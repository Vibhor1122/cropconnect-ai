# CropConnect AI

Build a modern responsive web application called "CropConnect AI".

CropConnect AI is a sustainable agriculture platform that directly connects farmers with crop buyers and wholesalers. The goal is to reduce food waste, unnecessary transportation, inefficient supply chains, and help farmers find buyers more efficiently.

This is a hackathon MVP, so focus on a polished working prototype.

DESIGN:

- Modern clean agricultural design

- White/off-white background

- Green as the primary accent color

- Professional startup-style UI

- Rounded cards and buttons

- Subtle animations

- Fully responsive for desktop and mobile

- Do not make it look like a generic template

- Use simple agriculture-related illustrations/icons where appropriate

LANDING PAGE:

Top navigation:

- CropConnect AI logo/name

- Home

- How It Works

- Impact

- "Get Started" button

Hero section:

Headline:

"From Farm to Market. Smarter."

Subtitle:

"An AI-powered marketplace connecting farmers directly with buyers — reducing waste, shortening supply chains, and creating a more sustainable food system."

Two prominent buttons:

"I’m a Farmer"

"I’m a Buyer"

Add a visual representing farmers, crops and buyers being connected through technology.

Below the hero, create a section:

"Why CropConnect?"

Three cards:

1. Reduce Food Waste

"Connect harvested produce with demand before it goes to waste."

2. Smarter Supply Chains

"Match buyers with suitable farmers instead of relying on inefficient multi-step sourcing."

3. Better Market Access

"Give farmers a simple way to discover demand beyond their immediate local market."

HOW IT WORKS SECTION:

For Farmers:

1. Tell us what you've harvested

2. AI structures your crop listing

3. Get matched with interested buyers

For Buyers:

1. Tell us what you need

2. AI searches available produce

3. Get ranked farmer matches

ENVIRONMENTAL IMPACT SECTION:

Create an attractive impact dashboard with demo statistics:

12,450 kg

Produce Matched

1,830 kg

Potential Food Waste Prevented

2,760 km

Supply Chain Distance Reduced

386 kg

Estimated CO₂ Avoided

Clearly write underneath:

"Demonstration estimates based on simulated marketplace activity."

FINAL CTA:

"Ready to build a smarter food supply chain?"

Buttons:

"List Your Crop"

"Find Produce"

FOOTER:

CropConnect AI

"Building a more efficient and sustainable agricultural supply chain."

Add:

"Built for NextStep Hacks 2026 — Earth Forward"

IMPORTANT:

When the user clicks "I'm a Farmer" or "List Your Crop", navigate to /farmer.

When the user clicks "I'm a Buyer" or "Find Produce", navigate to /buyer.

Create these two pages for now.

FARMER PAGE:

Heading:

"Sell Your Harvest Smarter"

Subtitle:

"Tell CropConnect what you've harvested and we'll help structure your listing."

Create a form containing:

- Farmer Name

- Crop

- Quantity (kg)

- Expected Price per kg

- Location

- Harvest Date

- Crop description

Also create a large alternative input:

"Describe your harvest naturally"

Placeholder:

"Example: I have around 800 kg of tomatoes harvested yesterday in Sonipat and I'm looking for at least ₹18 per kg."

Button:

"Create Listing with AI"

For now this button can generate a mock structured listing from the provided information.

BUYER PAGE:

Heading:

"Find the Right Produce"

Subtitle:

"Tell us what you need and CropConnect will find the best available farmers."

Create fields:

- Crop needed

- Quantity required

- Maximum price per kg

- Buyer location

Also add a natural-language search box:

Placeholder:

"Example: I need 1000 kg of wheat near Delhi under ₹28/kg."

Button:

"Find Smart Matches"

After clicking it, show three demo farmer results.

Result 1:

Rajesh Kumar

Wheat

1200 kg available

₹26/kg

Sonipat, Haryana

92% Match

Result 2:

Amit Singh

Wheat

1500 kg available

₹27/kg

Panipat, Haryana

87% Match

Result 3:

Suresh Yadav

Wheat

900 kg available

₹25/kg

Rohtak, Haryana

81% Match

Show match percentages prominently.

Add small explanations such as:

"Excellent price • Sufficient quantity • Close to buyer"

The application should feel like a functioning startup product rather than a static hackathon presentation.

Do not implement payment functionality yet.

Do not implement complicated authentication yet.

Do not add unnecessary features.

Prioritize excellent UX, responsiveness and a polished demo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18c6b49c-ec7f-432b-9430-37089728f6e4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
