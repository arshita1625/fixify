
# Fixify

Fixify is a home services app designed to connect users with local, reliable service providers such as plumbers, electricians, and cleaners. Built to address the inefficiencies in the current service-finding process, Fixify provides a secure and user-friendly platform that simplifies the process for both customers and providers.

---


## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
---

## About the Project
Fixify aims to eliminate the challenges associated with finding trustworthy service providers through traditional methods like word-of-mouth or unverified online listings. By offering a streamlined platform, Fixify allows users to:
- Discover verified local professionals.
- Submit service requests quickly and easily.
- Review and rate service providers to promote transparency.

For service providers, Fixify offers a platform to:
- Expand their client base.
- Showcase their skills and services.
- Build trust through customer reviews.

---

## Features
- **User Authentication:** Secure login and registration for users and service providers.
- **Service Discovery:** Browse and request local services based on your needs.
- **Rating and Reviews:** Transparent feedback mechanism to ensure quality.
- **Scalability:** Built to handle growing user and provider bases seamlessly.

---

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js and JWT Authentication
- **Deployment:** Railway

---

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Recommended version: 18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Installation and Setup
Follow these steps to set up and run Fixify locally:

#### 1️⃣ Clone the Repository
```sh
git clone [https://github.com/srithikraj/fixify.git]()
cd fixify
```

#### 2️⃣ Install Dependencies and Start Frontend App and Backend Server
- OPTION 1: run `sh ./start.sh`
- OPTION 2: follow the steps below

    - ##### 2.2 Install Dependencies for Frontend and Backend
        - OPTION 1: run `sh ./setup.sh`
        - OPTION 2:
            ```sh
            cd source_code
            cd frontend
            npm install
            cd ..

            cd backend
            npm install
            cd ..
            ```

    - ##### 2.3 Start the Frontend Development Server
        ```sh
        cd frontend
        npm run dev
        ```

    - ##### 2.4 Start the Backend Server
        ```sh
        cd ../backend
        node server.js
        ```

---

---

Excited to bring Fixify to life and make home service management easier for everyone!
