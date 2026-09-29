INSERT INTO product (name, price, description, daily_return_rate)
SELECT 'Aurora Growth Fund', 500.00, 'A balanced growth fund with steady returns', 0.0120
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Aurora Growth Fund');

INSERT INTO product (name, price, description, daily_return_rate)
SELECT 'Pulse Tech Portfolio', 1000.00, 'High-growth technology sector investment', 0.0180
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Pulse Tech Portfolio');

INSERT INTO product (name, price, description, daily_return_rate)
SELECT 'Steady Income Bond', 250.00, 'Low-risk, stable daily returns', 0.0060
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Steady Income Bond');

INSERT INTO product (name, price, description, daily_return_rate)
SELECT 'Nimbus Real Estate Trust', 750.00, 'Diversified property investment trust', 0.0100
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Nimbus Real Estate Trust');