
-- 1. Posta kodu 1010 olan müşteriler
SELECT *
FROM Customers
WHERE PostalCode = '1010';

-- 2. ID'si 11 olan tedarikçinin telefon numarası
SELECT Phone
FROM Suppliers
WHERE SupplierID = 11;

-- 3. Tarihe göre en yeni 10 sipariş
SELECT *
FROM Orders
ORDER BY OrderDate DESC
LIMIT 10;

-- 4. London, Madrid veya Brazil müşterileri
SELECT *
FROM Customers
WHERE City IN ('London', 'Madrid')
   OR Country = 'Brazil';

-- 5. Bilbo Baggins isimli müşteriyi ekle
INSERT INTO Customers (
  CustomerName,
  ContactName,
  Address,
  City,
  PostalCode,
  Country
)
VALUES (
  'The Shire',
  'Bilbo Baggins',
  '1 Hobbit-Hole',
  'Bag End',
  '111',
  'Orta Dünya'
);

-- 6. Bilbo Baggins posta kodunu güncelle
UPDATE Customers
SET PostalCode = '11122'
WHERE CustomerName = 'The Shire'
  AND ContactName = 'Bilbo Baggins';

-- ZORLAYICI GÖREV 1:
-- Tekrarsız şehir sayısı
SELECT COUNT(DISTINCT City) AS city_count
FROM Customers;

-- ZORLAYICI GÖREV 2:
-- Adı 20 karakterden uzun olan tedarikçiler
SELECT *
FROM Suppliers
WHERE LENGTH(SupplierName) > 20;
