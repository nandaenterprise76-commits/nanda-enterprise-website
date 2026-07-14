# PRD — Nanda Enterprise Website

## Problem Statement (Original)
User wants a highly professional, digitalised, advanced-level website for their father's distribution
business — Nanda Enterprise (20 Years of Trust) — dealing in multi-brand distributorship (MAK, HP, Gulf,
Veedol, Petronas, Diamond, MAHLE, Niterra, ASK, SKF, Makino, Magsol, Endurance, Rockman, Uno Minda,
TVS Tyres, Metro). Website must list every distributor company, drill down into each brand's products,
display features + price, allow filtering, and include a sliding hero banner. Not simple — digital,
premium, colour-forward.

## User Choices
- Public website + Admin panel (JWT auth)
- Mock/sample prices
- Professional stock images per category
- Color theme: Deep Midnight Navy + Electric Amber/Gold accents
- Enquiries saved to DB + shown in admin

## Personas
- Vehicle owner / mechanic browsing spares & lubes
- Dealer researching Power Wheels loyalty program
- Business partner reading policies
- Business owner (admin) managing brands / products / enquiries

## Architecture
- **Backend**: FastAPI + Motor (MongoDB), UUID string IDs, JWT auth via PyJWT + bcrypt
- **Frontend**: React 19 + React Router 7, Tailwind + Shadcn primitives, sonner for toasts,
  react-fast-marquee for brand ticker, framer-motion available
- **Design**: Barlow (headings) + Chivo (body) + JetBrains Mono (tech tags); midnight navy (#060A14)
  surfaces, amber accent (#FF9F1C), sharp corners (rounded-none), grain overlay, gridlines background
- **Seed data**: 18 brands + ~5 mock products each on first startup

## Implemented (Feb 2026)
- Backend: /api/auth/{login,me}, brands + products CRUD, public enquiries, admin enquiries + stats
- Frontend Pages: Home (hero carousel, marquee, categories, featured brands, Power Wheels banner),
  Brands (search + category filter), BrandDetail (sidebar sub-cat + price range + sort filters),
  ProductDetail (features + enquiry form + WhatsApp/call CTAs), PowerWheels (all 10 reward slabs +
  terms), About, Contact (dept lines + form), Policies (Cash Discount, Credit, Warranty),
  AdminLogin, AdminDashboard (stats, enquiries with status change/delete, products table, brands grid)
- Admin auto-seeded on startup; brands + products auto-seeded once

## Backlog (P1)
- Send enquiry notifications by email (Resend/SendGrid)
- Full admin CRUD forms (add/edit products & brands, image uploads via object storage)
- Real logo upload for each brand
- Instagram / Facebook actual social links
- Multilingual (Bengali) toggle
- Blog / News section for automotive tips

## Next Actions
- User to review look & feel and provide real logo files
- Optionally hook up email dispatch for enquiries
