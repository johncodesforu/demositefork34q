import { Product } from "../types";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  limit, 
  startAfter, 
  orderBy,
  addDoc,
  updateDoc
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

const COLLECTION = "products";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Test Product 1",
    description: "Quantum-grade test unit with high-fidelity performance metrics.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop"],
    category: "Wearables",
    inventory: 100,
    rating: 4.5,
    reviewsCount: 10,
    featured: true
  },
  {
    id: "p2",
    name: "Test Product 2",
    description: "Advanced prototype for futuristic data processing and lifestyle augmentation.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop"],
    category: "Home Office",
    inventory: 100,
    rating: 4.8,
    reviewsCount: 5
  },
  {
    id: "p3",
    name: "Test Product 3",
    description: "Sleek biometric accessory designed for universal compatibility.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"],
    category: "Apparel",
    inventory: 100,
    rating: 4.2,
    reviewsCount: 8
  },
  {
    id: "p4",
    name: "Test Product 4",
    description: "A precision instrument for the modern digital nomad.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"],
    category: "Wearables",
    inventory: 100,
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: "p5",
    name: "Test Product 5",
    description: "Home decoration unit with adaptive ambient intelligence.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop"],
    category: "Home Decoration",
    inventory: 50,
    rating: 4.6,
    reviewsCount: 20
  },
  {
    id: "p6",
    name: "Test Product 6",
    description: "Next-gen urban transit accessory for the mobile elite.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop"],
    category: "Transport",
    inventory: 30,
    rating: 5.0,
    reviewsCount: 3
  },
  {
    id: "p7",
    name: "Test Product 7",
    description: "Cyber-enhanceable apparel for any atmospheric condition.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop"],
    category: "Apparel",
    inventory: 45,
    rating: 4.4,
    reviewsCount: 12
  },
  {
    id: "p8",
    name: "Test Product 8",
    description: "Tactical streetwear with integrated thermoshielding.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop"],
    category: "Apparel",
    inventory: 60,
    rating: 4.7,
    reviewsCount: 25
  },
  {
    id: "p9",
    name: "Test Product 9",
    description: "Holographic interface module for advanced workstations.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"],
    category: "Home Office",
    inventory: 15,
    rating: 4.9,
    reviewsCount: 8
  },
  {
    id: "p10",
    name: "Test Product 10",
    description: "Neural-sync wristband for biometric data management.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop"],
    category: "Wearables",
    inventory: 80,
    rating: 4.3,
    reviewsCount: 42
  },
  {
    id: "p11",
    name: "Test Product 11",
    description: "Anti-gravity stabilization kit for micro-mobility units.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1519641473748-28c0cc5211b0?q=80&w=800&auto=format&fit=crop"],
    category: "Transport",
    inventory: 25,
    rating: 4.8,
    reviewsCount: 19
  },
  {
    id: "p12",
    name: "Test Product 12",
    description: "Bionic plant habitat with automated nutrient cycling.",
    price: 20.00,
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop"],
    category: "Home Decoration",
    inventory: 40,
    rating: 4.5,
    reviewsCount: 31
  }
];

export async function seedProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    if (querySnapshot.empty) {
      console.log("Database empty, starting seed process...");
      for (const product of MOCK_PRODUCTS) {
        const { id, ...data } = product;
        await addDoc(collection(db, COLLECTION), data);
      }
      console.log("Successfully seeded products");
    }
  } catch (error) {
    // If it's a permission error, we log it normally as it's expected for non-admins
    if (error instanceof Error && error.message.includes("permission")) {
      console.warn("Seeding skipped: Current user does not have admin permissions.");
    } else {
      console.error("Error seeding products:", error);
    }
  }
}

export async function getProducts(filters?: { category?: string; sort?: string; limit?: number }) {
  try {
    let q = query(collection(db, COLLECTION));
    
    if (filters?.category && filters.category !== "All") {
      q = query(q, where("category", "==", filters.category));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION}/${id}`);
    return null;
  }
}
