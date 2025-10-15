-- Use the database
USE loginapp;

-- Insert main categories (קטגוריות ראשיות בסגנון יד2)
INSERT INTO categories (name, name_he, icon, slug, description, display_order) VALUES
('vehicles', 'רכב', 'fa-car', 'vehicles', 'כלי רכב ואופנועים', 1),
('real-estate', 'נדל"ן', 'fa-building', 'real-estate', 'דירות ונדל"ן למכירה ולהשכרה', 2),
('jobs', 'דרושים', 'fa-briefcase', 'jobs', 'משרות ועבודות', 3),
('yad2', 'יד שניה', 'fa-sync', 'yad2', 'מוצרים יד שניה', 4),
('pets', 'חיות מחמד', 'fa-paw', 'pets', 'חיות מחמד ואביזרים', 5),
('business', 'עסקים', 'fa-store', 'business', 'עסקים למכירה', 6),
('services', 'שירותים', 'fa-tools', 'services', 'שירותים ומקצועות', 7),
('community', 'לוח קהילתי', 'fa-users', 'community', 'לוח קהילתי', 8);

-- Insert subcategories for Vehicles (רכב)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(1, 'private-cars', 'רכב פרטי', 'private-cars', 1),
(1, 'commercial', 'רכב מסחרי', 'commercial', 2),
(1, 'motorcycles', 'אופנועים', 'motorcycles', 3),
(1, 'trucks', 'משאיות', 'trucks', 4),
(1, 'classic', 'רכב קלאסי', 'classic', 5),
(1, 'accessories', 'אביזרים לרכב', 'accessories', 6);

-- Insert subcategories for Real Estate (נדל"ן)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(2, 'apartments-sale', 'דירות למכירה', 'apartments-sale', 1),
(2, 'apartments-rent', 'דירות להשכרה', 'apartments-rent', 2),
(2, 'houses', 'בתים למכירה', 'houses', 3),
(2, 'commercial-rent', 'מסחרי להשכרה', 'commercial-rent', 4),
(2, 'commercial-sale', 'מסחרי למכירה', 'commercial-sale', 5),
(2, 'roommates', 'שותפים לדירה', 'roommates', 6),
(2, 'parking', 'חניות', 'parking', 7);

-- Insert subcategories for Jobs (דרושים)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(3, 'high-tech', 'היי-טק', 'high-tech', 1),
(3, 'marketing', 'שיווק ומכירות', 'marketing', 2),
(3, 'finance', 'כספים וחשבונאות', 'finance', 3),
(3, 'customer-service', 'שירות לקוחות', 'customer-service', 4),
(3, 'education', 'חינוך והוראה', 'education', 5),
(3, 'healthcare', 'רפואה ובריאות', 'healthcare', 6),
(3, 'hospitality', 'מסעדנות ואירוח', 'hospitality', 7),
(3, 'construction', 'בניין ותעשייה', 'construction', 8);

-- Insert subcategories for Yad2 (יד שניה)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(4, 'furniture', 'ריהוט', 'furniture', 1),
(4, 'electronics', 'מוצרי חשמל', 'electronics', 2),
(4, 'computers', 'מחשבים וציוד נלווה', 'computers', 3),
(4, 'phones', 'טלפונים וסלולר', 'phones', 4),
(4, 'babies', 'תינוקות וילדים', 'babies', 5),
(4, 'fashion', 'אופנה והנעלה', 'fashion', 6),
(4, 'sports', 'ספורט ופנאי', 'sports', 7),
(4, 'music', 'כלי נגינה', 'music', 8),
(4, 'books', 'ספרים', 'books', 9),
(4, 'garden', 'גינה וחצר', 'garden', 10),
(4, 'art', 'אומנות ואספנות', 'art', 11),
(4, 'free-items', 'חינם לאיסוף', 'free-items', 12);

-- Insert subcategories for Pets (חיות מחמד)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(5, 'dogs', 'כלבים', 'dogs', 1),
(5, 'cats', 'חתולים', 'cats', 2),
(5, 'birds', 'ציפורים', 'birds', 3),
(5, 'fish', 'דגים ואקווריום', 'fish', 4),
(5, 'horses', 'סוסים', 'horses', 5),
(5, 'pet-accessories', 'אביזרים לחיות', 'pet-accessories', 6);

-- Insert subcategories for Business (עסקים)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(6, 'restaurants', 'מסעדות ובתי קפה', 'restaurants', 1),
(6, 'retail', 'חנויות וקמעונאות', 'retail', 2),
(6, 'franchises', 'זכיינות', 'franchises', 3),
(6, 'online-business', 'עסקים מקוונים', 'online-business', 4),
(6, 'services-business', 'עסקי שירותים', 'services-business', 5);

-- Insert subcategories for Services (שירותים)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(7, 'repairs', 'תיקונים ושיפוצים', 'repairs', 1),
(7, 'cleaning', 'ניקיון', 'cleaning', 2),
(7, 'photography', 'צילום ואירועים', 'photography', 3),
(7, 'tutoring', 'שיעורים פרטיים', 'tutoring', 4),
(7, 'legal', 'שירותים משפטיים', 'legal', 5),
(7, 'transportation', 'הובלות והסעות', 'transportation', 6),
(7, 'beauty', 'יופי וקוסמטיקה', 'beauty', 7),
(7, 'events', 'ארגון אירועים', 'events', 8);

-- Insert subcategories for Community (לוח קהילתי)
INSERT INTO subcategories (category_id, name, name_he, slug, display_order) VALUES
(8, 'announcements', 'מודעות', 'announcements', 1),
(8, 'lost-found', 'אבידות ומציאות', 'lost-found', 2),
(8, 'recommendations', 'המלצות', 'recommendations', 3),
(8, 'volunteering', 'התנדבות', 'volunteering', 4),
(8, 'carpools', 'טרמפים', 'carpools', 5);

SELECT 'Categories and subcategories data inserted successfully!' AS message;
