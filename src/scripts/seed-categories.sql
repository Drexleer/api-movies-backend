-- Seed script para precargar las categorías requeridas
-- Insertar las 4 categorías básicas: Terror, Suspenso, Drama, Comedia

INSERT INTO category (name, description, "isActive", "createdAt", "updatedAt") 
VALUES 
  ('Terror', 'Películas de terror y suspense psicológico', true, NOW(), NOW()),
  ('Suspenso', 'Películas de suspenso y thriller psicológico', true, NOW(), NOW()),
  ('Drama', 'Películas dramáticas que exploran emociones profundas', true, NOW(), NOW()),
  ('Comedia', 'Películas cómicas y de entretenimiento ligero', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Verificar las categorías insertadas
SELECT id, name, description, "isActive", "createdAt" FROM category ORDER BY name;
