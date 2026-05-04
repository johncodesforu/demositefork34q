# Security Specification - k34q's Demo

## 1. Data Invariants
- A product must have a name, price, and category.
- An order must belong to a signed-in user and have at least one item.
- Users can only read their own orders.
- Only admins (defined in `/admins/{userId}`) can modify the product catalog.

## 2. The "Dirty Dozen" Payloads
1. **Catalog Hijack**: Non-admin attempting to `create` a product in `/products`.
2. **Shadow Field Injection**: Adding `isVerified: true` to a user profile.
3. **Price Manipulation**: Updating a product price to `$0.01` from the client.
4. **Identity Spoofing**: Creating an order with a different `userId` than the authenticated user.
5. **PII Leak**: Attempting to `list` all users to scrape emails.
6. **Order Tampering**: Deleting a `processing` order by a non-owner.
7. **Junk ID Poisoning**: Using a 1MB string as a product ID.
8. **Recursive Cost Attack**: Triggering deep `get()` lookups in a list query.
9. **Role Escalation**: Self-assigning `admin: true` in the user document.
10. **Inventory Drain**: Setting `inventory: -9999` on a product.
11. **Spoofed Email**: Accessing admin data with an unverified email matching an admin email.
12. **Orphaned Order**: Creating an order for a product that doesn't exist.

## 3. The Test Plan
Using the rules below, we verify that:
- `allow list` on `products` is open to everyone.
- `allow write` on `products` is restricted to `isAdmin()`.
- `allow read, write` on `users/{userId}` is restricted to `request.auth.uid == userId`.
- `allow list` on `orders` is restricted to `resource.data.userId == request.auth.uid`.
