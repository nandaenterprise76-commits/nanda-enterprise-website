from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# --------- Config ---------
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
JWT_EXPIRE_HOURS = 12

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Nanda Enterprise API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nanda")

# --------- Helpers ---------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def get_current_admin(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# --------- Models ---------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class Brand(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    tagline: str = ""
    category: str  # Lubricants, Batteries, Tyres, Spare Parts, Car Care, Filters, Bearings
    description: str = ""
    logo_text: str = ""  # short 3-4 chars for stylised logo
    logo_image: str = ""  # external URL to real brand logo image
    hero_image: str = ""
    accent_color: str = "#FF9F1C"
    created_at: str = Field(default_factory=now_iso)

class BrandIn(BaseModel):
    slug: str
    name: str
    tagline: Optional[str] = ""
    category: str
    description: Optional[str] = ""
    logo_text: Optional[str] = ""
    logo_image: Optional[str] = ""
    hero_image: Optional[str] = ""
    accent_color: Optional[str] = "#FF9F1C"

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_slug: str
    name: str
    category: str
    sub_category: str = ""
    price: float
    unit: str = "pc"
    image: str = ""
    features: List[str] = []
    description: str = ""
    in_stock: bool = True
    created_at: str = Field(default_factory=now_iso)

class ProductIn(BaseModel):
    brand_slug: str
    name: str
    category: str
    sub_category: Optional[str] = ""
    price: float
    unit: Optional[str] = "pc"
    image: Optional[str] = ""
    features: Optional[List[str]] = []
    description: Optional[str] = ""
    in_stock: Optional[bool] = True

class EnquiryIn(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    city: Optional[str] = ""
    message: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    brand_slug: Optional[str] = None

class Enquiry(EnquiryIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    created_at: str = Field(default_factory=now_iso)

# --------- Routes: Auth ---------
@api.post("/auth/login")
async def login(data: LoginIn):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin")}}

@api.get("/auth/me")
async def me(user=Depends(get_current_admin)):
    return user

# --------- Routes: Brands ---------
@api.get("/brands", response_model=List[Brand])
async def list_brands():
    docs = await db.brands.find({}, {"_id": 0}).sort("name", 1).to_list(500)
    return docs

@api.get("/brands/{slug}", response_model=Brand)
async def get_brand(slug: str):
    doc = await db.brands.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Brand not found")
    return doc

@api.post("/brands", response_model=Brand)
async def create_brand(data: BrandIn, _=Depends(get_current_admin)):
    if await db.brands.find_one({"slug": data.slug}):
        raise HTTPException(400, "Slug already exists")
    b = Brand(**data.model_dump())
    await db.brands.insert_one(b.model_dump())
    return b

@api.put("/brands/{brand_id}", response_model=Brand)
async def update_brand(brand_id: str, data: BrandIn, _=Depends(get_current_admin)):
    await db.brands.update_one({"id": brand_id}, {"$set": data.model_dump()})
    doc = await db.brands.find_one({"id": brand_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Brand not found")
    return doc

@api.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str, _=Depends(get_current_admin)):
    await db.brands.delete_one({"id": brand_id})
    return {"ok": True}

# --------- Routes: Products ---------
@api.get("/products", response_model=List[Product])
async def list_products(brand_slug: Optional[str] = None, category: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if brand_slug:
        query["brand_slug"] = brand_slug
    if category:
        query["category"] = category
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    docs = await db.products.find(query, {"_id": 0}).to_list(2000)
    return docs

@api.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc

@api.post("/products", response_model=Product)
async def create_product(data: ProductIn, _=Depends(get_current_admin)):
    p = Product(**data.model_dump())
    await db.products.insert_one(p.model_dump())
    return p

@api.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, data: ProductIn, _=Depends(get_current_admin)):
    await db.products.update_one({"id": product_id}, {"$set": data.model_dump()})
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc

@api.delete("/products/{product_id}")
async def delete_product(product_id: str, _=Depends(get_current_admin)):
    await db.products.delete_one({"id": product_id})
    return {"ok": True}

# --------- Routes: Enquiries ---------
@api.post("/enquiries", response_model=Enquiry)
async def create_enquiry(data: EnquiryIn):
    e = Enquiry(**data.model_dump())
    await db.enquiries.insert_one(e.model_dump())
    return e

@api.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(_=Depends(get_current_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api.patch("/enquiries/{eid}")
async def update_enquiry_status(eid: str, status: str, _=Depends(get_current_admin)):
    await db.enquiries.update_one({"id": eid}, {"$set": {"status": status}})
    return {"ok": True}

@api.delete("/enquiries/{eid}")
async def delete_enquiry(eid: str, _=Depends(get_current_admin)):
    await db.enquiries.delete_one({"id": eid})
    return {"ok": True}

@api.get("/stats")
async def stats(_=Depends(get_current_admin)):
    return {
        "brands": await db.brands.count_documents({}),
        "products": await db.products.count_documents({}),
        "enquiries": await db.enquiries.count_documents({}),
        "new_enquiries": await db.enquiries.count_documents({"status": "new"}),
    }

@api.get("/")
async def root():
    return {"service": "Nanda Enterprise API", "status": "ok"}

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Seed Data ---------
SEED_BRANDS = [
    {"slug": "mak", "name": "MAK Lubricants", "tagline": "All Automotive & Industrial Lubricants", "category": "Lubricants", "logo_text": "MAK", "accent_color": "#E63946", "domain": "bharatpetroleum.in", "description": "Premium Bharat Petroleum lubricants engineered for peak engine performance across passenger cars, commercial vehicles and industrial machinery."},
    {"slug": "hp", "name": "HP Lubricants", "tagline": "Because your bike deserves main-character energy", "category": "Lubricants", "logo_text": "HP", "accent_color": "#00A651", "domain": "hindustanpetroleum.com", "description": "Hindustan Petroleum's flagship line of automotive and industrial lubricants including HP Racer Gen-G for two-wheelers."},
    {"slug": "veedol", "name": "Veedol", "tagline": "Lubricants & Car Care", "category": "Lubricants", "logo_text": "VDL", "accent_color": "#0057B7", "domain": "veedol.com", "description": "Legacy engine oils and car care solutions with over a century of motoring heritage."},
    {"slug": "petronas", "name": "Petronas", "tagline": "Automotive Lubricants", "category": "Lubricants", "logo_text": "PTX", "accent_color": "#00A19A", "domain": "pli-petronas.com", "description": "Fluid technology solutions engineered in Turin — Petronas Syntium, Sprinta and Urania ranges."},
    {"slug": "gulf", "name": "Gulf Pride", "tagline": "Start Mast Toh Din Zabardast", "category": "Batteries", "logo_text": "GLF", "accent_color": "#FF6B00", "domain": "gulfoilindia.com", "description": "Gulf Pride two-wheeler batteries with maintenance-free technology and superior cold-cranking performance."},
    {"slug": "varroc", "name": "Varroc", "tagline": "Full range two-wheeler spares & fibre", "category": "Spare Parts", "logo_text": "VRC", "accent_color": "#D62828", "domain": "varrocgroup.com", "description": "OEM-grade two-wheeler electricals, lighting, fibre body panels and mechanical spares."},
    {"slug": "diamond", "name": "Diamond Chain", "tagline": "TI India — Chain Kits & More", "category": "Spare Parts", "logo_text": "DMD", "accent_color": "#1D3557", "domain": "tichains.com", "description": "Precision-engineered chain-sprocket kits by Tube Investments of India, built for endurance and low elongation."},
    {"slug": "mahle", "name": "MAHLE", "tagline": "Filtration & Engine Components", "category": "Filters", "logo_text": "MHL", "accent_color": "#00843D", "domain": "mahle.com", "description": "German engineering excellence — oil, air, cabin and fuel filters plus critical engine components."},
    {"slug": "niterra", "name": "Niterra (NGK & NTK)", "tagline": "Aapki Gaadi Ka Mr. Dependable", "category": "Spare Parts", "logo_text": "NGK", "accent_color": "#FDB913", "domain": "niterra.com", "description": "Global leader in spark plugs, ignition coils and oxygen sensors — formerly NGK Spark Plug Co."},
    {"slug": "ask", "name": "ASK Automotive", "tagline": "Brake Shoes, Cables & More", "category": "Spare Parts", "logo_text": "ASK", "accent_color": "#8338EC", "domain": "askautoltd.com", "description": "Two-wheeler friction materials, brake shoes and control cables trusted by major OEMs across India."},
    {"slug": "skf", "name": "SKF", "tagline": "Bearings & Rotating Solutions", "category": "Bearings", "logo_text": "SKF", "accent_color": "#005AA7", "domain": "skf.com", "description": "Swedish precision bearings, seals and lubrication systems for automotive and industrial applications."},
    {"slug": "makino", "name": "Makino", "tagline": "Brake Shoes & Friction", "category": "Spare Parts", "logo_text": "MKN", "accent_color": "#457B9D", "domain": "makinoauto.com", "description": "High-durability brake shoes and clutch components engineered for Indian road conditions."},
    {"slug": "magsol", "name": "Magsol", "tagline": "A Dorf Ket Brand — Car Care", "category": "Car Care", "logo_text": "MGS", "accent_color": "#F72585", "domain": "dorfketal.com", "description": "Complete car care line — shampoos, polishes, dashboard shiners and premium wax coatings."},
    {"slug": "endurance", "name": "Endurance", "tagline": "Complete Two-Wheeler Solutions", "category": "Spare Parts", "logo_text": "END", "accent_color": "#EF476F", "domain": "endurancegroup.com", "description": "Suspension, transmission, braking and alloy wheel systems from India's OEM powerhouse."},
    {"slug": "rockman", "name": "Rockman", "tagline": "Chain Kits & Precision Parts", "category": "Spare Parts", "logo_text": "RCK", "accent_color": "#2A9D8F", "domain": "rockmangroup.com", "description": "Hero MotoCorp-backed chain kits and machined components engineered for silent, long-life operation."},
    {"slug": "uno-minda", "name": "Uno Minda", "tagline": "Driving the new two-wheeler spare", "category": "Spare Parts", "logo_text": "UMD", "accent_color": "#E76F51", "domain": "unominda.com", "description": "Switches, horns, sensors, lighting and connectors — the electronic backbone of modern two-wheelers."},
    {"slug": "tvs-tyres", "name": "TVS Tyres", "tagline": "Grip that never quits", "category": "Tyres", "logo_text": "TVS", "accent_color": "#003399", "domain": "tvstyres.com", "description": "Two-wheeler tyres engineered with proprietary Silica-Rich compounds for wet & dry grip."},
    {"slug": "metro", "name": "Metro Tyres", "tagline": "For Two-Wheeler & Toto", "category": "Tyres", "logo_text": "MTR", "accent_color": "#6A0572", "domain": "metrotyres.com", "description": "Robust two-wheeler and e-rickshaw (Toto) tyres built for Indian last-mile mobility."},
]

def _logo_url_for(domain: str) -> str:
    return f"https://www.google.com/s2/favicons?domain={domain}&sz=256"

def _mock_products_for_brand(b):
    cat = b["category"]
    slug = b["slug"]
    variants = {
        "Lubricants": [
            ("Engine Oil 20W-40 Premium", "1L", 480, ["High-temperature stability", "Anti-wear additives", "Extended drain interval", "API SN certified"], "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800"),
            ("Fully Synthetic 5W-30", "1L", 899, ["Cold-start protection", "Superior fuel economy", "Turbo-charged engine ready"], "https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=800"),
            ("2T Racing Oil", "500ml", 320, ["JASO FC certified", "Low smoke", "Anti-scuffing"], "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"),
            ("Gear Oil 80W-90", "500ml", 275, ["EP additives", "Anti-foam", "Thermal stability"], "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800"),
            ("Industrial Hydraulic 68", "20L", 3400, ["Anti-wear ZDDP", "Water separation", "Long service life"], "https://images.unsplash.com/photo-1613214149922-f16a2e6db08d?w=800"),
        ],
        "Batteries": [
            ("VRLA Battery 12V 5Ah", "pc", 1650, ["Maintenance free", "Deep cycle", "Vibration resistant", "18-month warranty"], "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800"),
            ("Hi-Cranking 9Ah Battery", "pc", 2100, ["High CCA", "Faster cold-start", "Sealed AGM"], "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800"),
            ("Scooter Battery 4Ah", "pc", 1350, ["Compact form-factor", "Zero maintenance"], "https://images.unsplash.com/photo-1621252179027-9262b6716f0c?w=800"),
        ],
        "Tyres": [
            ("Tubeless 90/90-12 City", "pc", 1450, ["Silica-rich compound", "Wet-grip pattern", "6000 km tread life"], "https://images.unsplash.com/photo-1568105271152-caab6a24a2e2?w=800"),
            ("Sport 110/80-17 Radial", "pc", 2890, ["Deep V-groove", "Nylon carcass", "High-speed rated"], "https://images.unsplash.com/photo-1621252179027-9262b6716f0c?w=800"),
            ("Toto 4.00-8 E-Rickshaw", "pc", 1180, ["Heavy load index", "Puncture resistant compound"], "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?w=800"),
            ("Off-Road 90/100-10 Knobby", "pc", 1690, ["Aggressive tread", "Rugged sidewall"], "https://images.unsplash.com/photo-1626668893632-6f3a4466d109?w=800"),
        ],
        "Spare Parts": [
            ("Chain-Sprocket Kit 428H", "set", 980, ["Heat-treated pins", "O-ring sealed", "45,000 km service"], "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"),
            ("Brake Shoe Front-Rear Set", "set", 340, ["Asbestos-free lining", "Uniform wear pattern"], "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800"),
            ("Clutch Plate Assembly", "pc", 720, ["Kevlar friction pads", "Precision-ground"], "https://images.unsplash.com/photo-1621252179027-9262b6716f0c?w=800"),
            ("Spark Plug Iridium IX", "pc", 460, ["0.6mm iridium tip", "Improved ignition", "Longer life"], "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800"),
            ("Headlamp Assembly LED", "pc", 1240, ["6000K color temp", "IP67 waterproof"], "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"),
            ("Speedometer Cable", "pc", 145, ["Corrosion-resistant sheath", "Flexible core"], "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800"),
        ],
        "Filters": [
            ("Oil Filter Cartridge", "pc", 220, ["Micro-glass media", "Anti-drain valve"], "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800"),
            ("Air Filter Element", "pc", 380, ["High dust holding", "Multi-pleat design"], "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800"),
            ("Cabin AC Filter", "pc", 540, ["Activated carbon", "PM 2.5 filtration"], "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800"),
        ],
        "Bearings": [
            ("Deep-Groove Ball Bearing 6203", "pc", 165, ["C3 clearance", "Sealed both sides", "Low friction"], "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800"),
            ("Wheel Hub Bearing Kit", "set", 1240, ["Pre-greased", "ABS-compatible"], "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"),
            ("Taper Roller Bearing 30204", "pc", 380, ["High load capacity", "Precision ground"], "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800"),
        ],
        "Car Care": [
            ("Premium Wax Polish 250ml", "250ml", 420, ["Carnauba blend", "UV protection", "3-month gloss"], "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?w=800"),
            ("Dashboard Shiner Spray", "500ml", 260, ["Anti-static", "Non-greasy finish"], "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800"),
            ("Car Shampoo Concentrate 1L", "1L", 380, ["pH-neutral", "High-foam formula"], "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800"),
            ("Tyre Shine Gel 500g", "500g", 220, ["Deep black finish", "Water repellent"], "https://images.unsplash.com/photo-1568105271152-caab6a24a2e2?w=800"),
        ],
    }
    items = variants.get(cat, variants["Spare Parts"])
    products = []
    for name, unit, price, feats, img in items:
        products.append({
            "brand_slug": slug,
            "name": f"{b['name'].split()[0]} {name}",
            "category": cat,
            "sub_category": name.split()[0],
            "price": float(price),
            "unit": unit,
            "image": img,
            "features": feats,
            "description": f"Genuine {b['name']} — {name}. Distributed by Nanda Enterprise with 20 years of trusted service.",
            "in_stock": True,
        })
    return products

@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.brands.create_index("slug", unique=True)
    await db.products.create_index([("brand_slug", 1)])

    # Seed admin (idempotent)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@nandaenterprise.com").lower()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "NandaAdmin@2026")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_pw),
            "name": "Nanda Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_pw, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_pw)}})
        logger.info("Updated admin password for: %s", admin_email)

    # Seed brands + products
    if await db.brands.count_documents({}) == 0:
        for b in SEED_BRANDS:
            b_copy = {k: v for k, v in b.items() if k != "domain"}
            b_copy["logo_image"] = _logo_url_for(b["domain"])
            brand = Brand(**b_copy)
            await db.brands.insert_one(brand.model_dump())
            for p in _mock_products_for_brand(b):
                prod = Product(**p)
                await db.products.insert_one(prod.model_dump())
        logger.info("Seeded %d brands with products", len(SEED_BRANDS))
    else:
        # Backfill logo_image for existing seeded brands
        domain_by_slug = {b["slug"]: b["domain"] for b in SEED_BRANDS}
        cursor = db.brands.find({"$or": [{"logo_image": {"$exists": False}}, {"logo_image": ""}]}, {"_id": 0})
        async for doc in cursor:
            d = domain_by_slug.get(doc["slug"])
            if d:
                await db.brands.update_one({"id": doc["id"]}, {"$set": {"logo_image": _logo_url_for(d)}})
        logger.info("Backfilled logo_image for existing brands")

@app.on_event("shutdown")
async def shutdown():
    client.close()
