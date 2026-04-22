**Conflict Tracker (Frontend + Backend)**

*URL publica Frontend*= https://vite-trucker1.vercel.app

*URL publica Backend*= https://conflict-tracker-production-3025.up.railway.app

***Esquema de l’arquitectura utilitzada***

**Frontend (Vue+Vite)**

-SPA amb Vue Router

-Consum d’API REST via fetch

-Deploy a Vercel

**Backend (Spring Boot + Java)**

-API REST amb endpoints CRUD i consultes

-DTOs + Services + Repositories (JPA/Hibernate)

-Base de dades: H2 en local / PostgreSQL en producció (Railway)

-Deploy a Railway

**Base de dades (PostgreSQL/Supabase)**

-Provisió i gestió des de Railway i Supabase

****Diagrama****

<img width="1217" height="669" alt="image" src="https://github.com/user-attachments/assets/905982cd-0be8-4e7f-9cc8-f5cf16279196" />




****Variables d'entorns****

<img width="875" height="344" alt="image" src="https://github.com/user-attachments/assets/844650d0-9917-4af1-b093-95c70fe7bac9" />


Estas son les variables d'entons que he fet servir.. per modificarles nomes has de donar click als tres punts de la dreta i editar. Tambe si vols pots añadir una nova.

*Com configurar-ho a Railway:*

  1-Service → Variables
  
  2-Afegir les variables
  
  3-Redeploy


***Modificacions necesaries per el correct funcionament del proyecte***

Backend:

1-**CORS per permetre el frontend**

-Error al navegador: CORS header 'Access-Control-Allow-Origin' missing en cridar l’API des de Vercel.

-Solució: Vaig crear el ficher CorsConfig.java a src/main/java/.../config amb configuracions clau per resoldre el conflicte.


2-**Railway no podia executar ./mvnw**

-Error inicial: ./mvnw: Permission denied

-Solució: Vaig tenir que cambiar a Railway → Settings → Build → Custom Build Command el valor de "./mvnw -DskipTests clean package" a "mvn -DskipTests clean package"


Frontend:

3-**Doble barra //api/... a la URL de l’API**

-Error: “NetworkError / No s'han pogut carregar les dades”. A Railway HTTP logs: GET //api/v1/conflicts → 404.

-Solucio:  EN la variable VITE_API_URL es va deixar sense / final, que ho habia afegit per error.

4-**Error quan intentava entrar directament o fer f5 a https://vite-trucker1.vercel.app/conflicts amb -> /conflicts al final**

-Error: 404 NOT_FOUND quan accedia o refrescaba la pagina amb /conflicts al final.

-Solucio: Vaig crear a l'arrel del projecte el fitxer vercel.json .






