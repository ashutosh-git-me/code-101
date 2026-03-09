#!/bin/bash
echo "=========================================="
echo "    SIMULATED TAMPERING TEST - TAG"
echo "=========================================="
echo ""

# Wait for server to be ready
echo "1. Waiting for local server to be responsive..."
while ! curl -s http://localhost:3001 > /dev/null; do
  sleep 1
done

# Generate a random serial to avoid collisions during multiple runs
SERIAL="TEST-$(date +%s)"

echo -e "\n2. Registering a new Product (Genesis Block)..."
REGISTER_RES=$(curl -s -X POST http://localhost:3001/api/tag/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Diamond Ring\", \"serialNumber\": \"$SERIAL\", \"manufacturer\": \"Tiffany\"}")

echo "Response:"
echo "$REGISTER_RES" | grep -o '.*' # using grep -o '.*' to keep output clean, could use jq if installed

# Extract product ID (hacky bash way without jq)
PRODUCT_ID=$(echo "$REGISTER_RES" | grep -o '"ID":"[^"]*' | head -n 1 | cut -d'"' -f4)

if [ -z "$PRODUCT_ID" ]; then
  echo "=> FAIL: Could not extract Product ID."
  exit 1
fi

echo -e "\n\n3. Adding lifecycle entry: 'Quality Inspection Passed'"
UPDATE_RES=$(curl -s -X POST http://localhost:3001/api/tag/update \
  -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\", \"eventType\": \"Quality Inspection Passed\", \"verifiedBy\": \"Inspector_01\", \"metadata\": \"Location: NYC Facility, Batch: A41\"}")
echo "Response:"
echo "$UPDATE_RES"

# Extract LedgerEntry ID for the update
UPDATE_ENTRY_ID=$(echo "$UPDATE_RES" | grep -o '"ID":"[^"]*' | head -n 1 | cut -d'"' -f4)

echo -e "\n\n4. Verifying Pristine Ledger..."
VERIFY_RES_1=$(curl -s -X POST http://localhost:3001/api/tag/verify \
  -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\"}")
echo "Response:"
echo "$VERIFY_RES_1"
IS_AUTHENTIC_1=$(echo "$VERIFY_RES_1" | grep -o '"isAuthentic":true')

if [ ! -z "$IS_AUTHENTIC_1" ]; then
  echo "=> SUCCESS: Pristine ledger is Authentic."
else
  echo "=> FAIL: Pristine ledger reported as not authentic."
  exit 1
fi

echo -e "\n\n5. TAMPERING WITH DATABASE DIRECTLY..."
echo "Simulating a bad actor changing the Inspector's name ('Inspector_01' to 'HACKER_99') directly in the LedgerEntry table."
# Use sqlite3 to manually update the record without recalculating the hash
sqlite3 prisma/dev.db "UPDATE LedgerEntry SET Verified_By = 'HACKER_99' WHERE ID = '$UPDATE_ENTRY_ID';"
echo "=> Database tampered."

echo -e "\n\n6. Verifying Tampered Ledger..."
VERIFY_RES_2=$(curl -s -X POST http://localhost:3001/api/tag/verify \
  -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\"}")
echo "Response:"
echo "$VERIFY_RES_2"
IS_AUTHENTIC_2=$(echo "$VERIFY_RES_2" | grep -o '"isAuthentic":false')

if [ ! -z "$IS_AUTHENTIC_2" ]; then
  echo "=> SUCCESS: System correctly identified the tampered data and raised an alert!"
else
  echo "=> FAIL: System missed the tampering!"
  exit 1
fi

echo -e "\n=========================================="
echo "    TEST PASSED COMPLETELY"
echo "=========================================="
