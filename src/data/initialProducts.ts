import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "JWL-R01",
    name: "Amara Solitaire Diamond Ring",
    description: "A breathtaking classic solitaire engagement ring featuring a hand-selected conflict-free brilliant cut diamond. Set meticulously in an ultra-polished 950 Platinum band for everlasting radiance.",
    priceKSh: 325000,
    category: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    material: "950 Platinum",
    gemstone: "VVS1 Round Brilliant Diamond",
    stars: 4.9,
    stock: 5,
    tryOnOffset: {
      scale: 0.95,
      rotation: 0,
      yOffset: 45,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-ETH-9104",
      mintedAddress: "0x7a8d56b4df12a2ee347b8ebd89047f0cf104cb34",
      minedSource: "Koffiefontein Mine, Ethical Sourcing Protocol",
      mineralPurity: "95% Pure Platinum",
      weightCarat: 1.25,
      cutSpecification: "Excellent Ideal Cut",
      ethicallySourced: true,
      blockchainTimestamp: "2026-02-12 10:44:19 UTC"
    },
    reviews: [
      { id: "REV-101", userName: "Amani Mwangi", rating: 5, comment: "Absolutely stunning ring! The blockchain authentication certificate gives immense peace of mind. Truly a masterpiece.", date: "2026-03-01" },
      { id: "REV-102", userName: "David Ochieng", rating: 5, comment: "Proposed with this ring and she loved it. The virtual try-on on her phone was surprisingly accurate for size reference!", date: "2026-04-15" }
    ]
  },
  {
    id: "JWL-N01",
    name: "Tsavo Emerald Droplet Pendant",
    description: "Inspired by the lush greenery of the Tsavo. A prominent pear-shaped vivid green Tsavo emerald suspended from a delicate 18K solid yellow gold chain, surrounded by a micro-pavé Diamond cluster.",
    priceKSh: 195000,
    category: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    material: "18K Yellow Gold",
    gemstone: "Natural Tsavo Emerald",
    stars: 4.8,
    stock: 3,
    tryOnOffset: {
      scale: 1.1,
      rotation: 0,
      yOffset: 120,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-EMR-4832",
      mintedAddress: "0x39f50e83b400fa11ccdf87630712a86ee07fc9a1",
      minedSource: "Tsavo Geological Reserve Artisanal Cooperative, Kenya",
      mineralPurity: "18K Gold (75.0% Fine)",
      weightCarat: 2.10,
      cutSpecification: "Pear Faceted Cut",
      ethicallySourced: true,
      blockchainTimestamp: "2026-03-30 14:12:05 UTC"
    },
    reviews: [
      { id: "REV-201", userName: "Wanjiku N.", rating: 5, comment: "Marvelous color. Deep green shade that gets compliments every single time I wear it.", date: "2026-05-02" }
    ]
  },
  {
    id: "JWL-E01",
    name: "Mombasa Pearl Droplet Earrings",
    description: "Classic drop earrings featuring perfectly matched South Sea golden pearls. Elegant leverback fixtures crafted in luxury 18K solid white gold that drop gracefully for formal or evening wear.",
    priceKSh: 145000,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    material: "18K White Gold",
    gemstone: "Golden South Sea Cultured Pearl",
    stars: 4.7,
    stock: 8,
    tryOnOffset: {
      scale: 1.0,
      rotation: 15,
      yOffset: 30,
      xOffset: -60 // shifted to left ear position by default
    },
    certificate: {
      certificateId: "CERT-PRL-2201",
      mintedAddress: "0x8891bca762bf62cfdac0e9a7812fcc0b29381e4b",
      minedSource: "Indian Ocean Sustainable Aquaculture, Mombasa Coast",
      mineralPurity: "18K Gold (75.0% Fine Pearl Settings)",
      weightCarat: 0.15, // metal weight, pearls are 11.2mm
      cutSpecification: "Perfect Spherical Round",
      ethicallySourced: true,
      blockchainTimestamp: "2026-04-10 09:22:58 UTC"
    },
    reviews: [
      { id: "REV-301", userName: "Zainab Rashid", rating: 4, comment: "Excellent luster! Matches my wedding gown beautifully. Shipping with the armored courier took just 1 day to Kisumu.", date: "2026-05-10" }
    ]
  },
  {
    id: "JWL-B01",
    name: "Rift Onyx Minimalist Bangle",
    description: "A beautiful contemporary open-style bangle handcrafted with double-sided volcanic Obsidian Onyx tips. Sculpted in solid 18K yellow gold of structural brilliance, embodying premium minimalistic design.",
    priceKSh: 110000,
    category: "bracelets",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600",
    material: "18K Yellow Gold",
    gemstone: "Volcanic Obsidian Onyx",
    stars: 4.6,
    stock: 12,
    tryOnOffset: {
      scale: 0.9,
      rotation: -10,
      yOffset: 85,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-ONY-5561",
      mintedAddress: "0xfc1c2ef3049102caeeda7cb1a4bc5ef4b64bb932",
      minedSource: "Rift Valley Volcanic Slabs, Naivasha Area, Kenya",
      mineralPurity: "18K Gold Bonded Frame",
      weightCarat: 4.50,
      cutSpecification: "Cabochon Smooth-Polished",
      ethicallySourced: true,
      blockchainTimestamp: "2026-01-18 16:05:41 UTC"
    },
    reviews: []
  },
  {
    id: "JWL-R02",
    name: "Tana River Gold Band",
    description: "A heavy-weight luxury dome band crafted to represent the elegant, fluid waters of the Tana River. Hand-hammered texture creates dual-reflective surfaces in 22K yellow gold of unique distinction.",
    priceKSh: 85000,
    category: "rings",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600",
    material: "22K Yellow Gold",
    gemstone: "None (Solid Pattern Metals)",
    stars: 4.9,
    stock: 15,
    tryOnOffset: {
      scale: 0.85,
      rotation: 0,
      yOffset: 45,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-GLD-0043",
      mintedAddress: "0xec72fa8290fa8226cca6738dfbc1ef263884cbab",
      minedSource: "Alluvial Gold Cooperative, Tana River Basins",
      mineralPurity: "22K Solid Gold (91.6% Pure)",
      weightCarat: 0.00, // zero gemstone carats
      cutSpecification: "Artisanal Hand-Hammered",
      ethicallySourced: true,
      blockchainTimestamp: "2026-05-19 08:33:14 UTC"
    },
    reviews: [
      { id: "REV-501", userName: "Kipruto L.", rating: 5, comment: "The design is simple but solid. Weighted well. Absolutely recommend.", date: "2026-05-25" }
    ]
  },
  {
    id: "JWL-N02",
    name: "Mara Sapphire Infinite Collier",
    description: "A premium masterpiece. An endless line of deeply saturated midnight-blue Madagascar sapphires totalizing dozens of carats. Alternated with microscopic sparkling white diamonds in a fluid platinum frame.",
    priceKSh: 495000,
    category: "necklaces",
    image: "https://images.unsplash.com/photo-1624510461623-1d00c4068cc0?auto=format&fit=crop&q=80&w=600",
    material: "950 Platinum",
    gemstone: "Midnight-Blue Madagascar Sapphires",
    stars: 5.0,
    stock: 2,
    tryOnOffset: {
      scale: 1.2,
      rotation: 0,
      yOffset: 120,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-SAP-1299",
      mintedAddress: "0xd47bc8cb91cb8fb76e73bcca74ef9a12368ee345",
      minedSource: "Ilakaka Deposit Ethical Partner, Madagascar",
      mineralPurity: "95% Pure Platinum",
      weightCarat: 14.80,
      cutSpecification: "Oval Crown Brilliant Cut",
      ethicallySourced: true,
      blockchainTimestamp: "2026-05-01 11:22:10 UTC"
    },
    reviews: [
      { id: "REV-601", userName: "Fatuma Ali", rating: 5, comment: "Unbelievable sparkle. This is a family heirloom piece that I will cherish forever. Beautiful verification details.", date: "2026-05-30" }
    ]
  },
  {
    id: "JWL-B02",
    name: "Tsavo Diamond Tennis Bracelet",
    description: "The peak of status. Classic, seamless fluid row of identical Round Brilliant cut diamonds of exceptional purity, prong-held in a flexible premium 18K solid white gold bracelet.",
    priceKSh: 420000,
    category: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    material: "18K White Gold",
    gemstone: "D-Color Flawless Diamonds",
    stars: 4.9,
    stock: 4,
    tryOnOffset: {
      scale: 1.0,
      rotation: -5,
      yOffset: 85,
      xOffset: 0
    },
    certificate: {
      certificateId: "CERT-DIA-8812",
      mintedAddress: "0x09da10d8ef732baecde26ab0732ee781ccbf9213",
      minedSource: "Kao Diamond Fields, Certified Kimberley Process",
      mineralPurity: "18K Gold (75.0% Fine Settings)",
      weightCarat: 5.40,
      cutSpecification: "Excellent Hearts & Arrows",
      ethicallySourced: true,
      blockchainTimestamp: "2026-05-15 15:19:00 UTC"
    },
    reviews: []
  },
  {
    id: "JWL-E02",
    name: "Nakuru Ruby Sunburst Studs",
    description: "An intense, glowing gaze. Twin exceptional-grade natural pigeon blood Rubies from the Rift Valley mountains, mounted in an aura of sparkling halo pear diamonds set in 18K white gold.",
    priceKSh: 180000,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600",
    material: "18K White Gold",
    gemstone: "Rubies & Cluster Diamonds",
    stars: 4.8,
    stock: 6,
    tryOnOffset: {
      scale: 1.0,
      rotation: 0,
      yOffset: 30,
      xOffset: -60
    },
    certificate: {
      certificateId: "CERT-RUB-7231",
      mintedAddress: "0xfa12760920caa1efcf2b2609088fdc0be9fac913",
      minedSource: "Baringo Geological Belt Cooperatives, Kenya",
      mineralPurity: "18K White Gold",
      weightCarat: 1.85,
      cutSpecification: "Round Faceted Brilliant Stud",
      ethicallySourced: true,
      blockchainTimestamp: "2026-04-20 20:10:04 UTC"
    },
    reviews: [
      { id: "REV-801", userName: "Jane Waithera", rating: 5, comment: "Exquisite and powerful red shade. Fast insured courier delivery to Nakuru. Five stars!", date: "2026-05-14" }
    ]
  }
];
