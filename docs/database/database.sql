-- Script SQL para la base de datos de películas

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, description) VALUES
  ('Terror', 'Películas de horror y suspense psicológico'),
  ('Suspenso', 'Películas de thriller y misterio'),
  ('Drama', 'Películas dramáticas y emotivas'),
  ('Comedia', 'Películas cómicas y de entretenimiento');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  avatar VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  original_title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  release_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- en minutos
  rating VARCHAR(10) NOT NULL, -- PG, PG-13, R, etc.
  director VARCHAR(200) NOT NULL,
  cast TEXT[], -- Array de actores principales
  genres TEXT[], -- Array de géneros adicionales
  country VARCHAR(100) NOT NULL,
  language VARCHAR(50) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imdb_rating DECIMAL(3,1), -- 1.0-10.0
  poster VARCHAR(500), -- URL de la imagen
  backdrop VARCHAR(500), -- URL del fondo
  trailer VARCHAR(500), -- URL del trailer
  budget BIGINT, -- Presupuesto en dólares
  box_office BIGINT, -- Recaudación en dólares
  awards TEXT[] -- Array de premios
);

CREATE TABLE user_movies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  movie_id INTEGER NOT NULL REFERENCES movies(id),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 estrellas del usuario
  review TEXT, -- Reseña del usuario
  is_favorite BOOLEAN DEFAULT FALSE,
  watch_time INTEGER, -- Tiempo visto en minutos
  completed_movie BOOLEAN DEFAULT TRUE, -- Si terminó de ver la película
  UNIQUE(user_id, movie_id)
);

-- Índices para optimizar consultas
CREATE INDEX idx_movies_release_date ON movies(release_date);
CREATE INDEX idx_movies_category_id ON movies(category_id);
CREATE INDEX idx_movies_title ON movies USING GIN(to_tsvector('spanish', title));
CREATE INDEX idx_user_movies_user_id ON user_movies(user_id);
CREATE INDEX idx_user_movies_movie_id ON user_movies(movie_id);
CREATE INDEX idx_users_email ON users(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
