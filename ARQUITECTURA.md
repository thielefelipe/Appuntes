# Arquitectura - Appuntes

## 1. Estructura de Carpetas

```
appuntes/
├── app/
│   ├── (auth)/                    # Rutas de autenticación
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/               # Dashboard protegido
│   │   ├── alumno/
│   │   │   ├── page.tsx          # Home alumno
│   │   │   ├── cursos/
│   │   │   ├── mis-clases/
│   │   │   └── perfil/
│   │   ├── docente/
│   │   │   ├── page.tsx          # Home docente
│   │   │   ├── disponibilidad/
│   │   │   ├── mis-clases/
│   │   │   └── ingresos/
│   │   └── admin/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── courses/route.ts
│   │   ├── classes/route.ts       # Sesiones en vivo
│   │   ├── subscriptions/route.ts
│   │   ├── payments/
│   │   │   ├── subscribe/route.ts
│   │   │   └── webhook/route.ts   # Mercado Pago webhook
│   │   └── teachers/route.ts
│   ├── page.tsx                   # Home público
│   └── layout.tsx                 # Root layout
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── courses/
│   ├── classes/
│   └── ui/                        # Shadcn/ui components
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── auth.ts                    # NextAuth config
│   ├── mercadopago.ts
│   ├── daily.ts                   # Daily.co API
│   └── utils.ts
├── prisma/
│   ├── schema.prisma              # Esquema de BD
│   └── migrations/
├── public/
├── .env.local                     # Variables locales
├── .env.example
├── package.json
└── tsconfig.json
```

## 2. Base de Datos (Prisma + PostgreSQL)

### Modelos principales:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  avatar        String?
  role          UserRole  // STUDENT, TEACHER, ADMIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relaciones
  studentProfile    StudentProfile?
  teacherProfile    TeacherProfile?
  subscriptions     Subscription[]
  bookings          ClassBooking[]
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

model StudentProfile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  gradeLevel    String    // "1°M", "2°M", "3°M", "4°M", "PAES"
  subscriptionEndsAt DateTime?
  
  bookings      ClassBooking[]
}

model TeacherProfile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject       String    // "Matemática", "Lenguaje", "Ciencias", "Inglés"
  hourlyRate    Float     // Precio por hora de clase
  bio           String?
  verificationStatus String  // PENDING, VERIFIED, REJECTED
  
  classes       VirtualClass[]
}

model Course {
  id            String    @id @default(cuid())
  title         String
  subject       String    // "Matemática", "Lenguaje", "Ciencias", "Inglés"
  description   String
  level         String    // "1°M", "2°M", "3°M", "4°M", "PAES"
  
  videos        Video[]
}

model Video {
  id            String    @id @default(cuid())
  courseId      String
  course        Course    @relation(fields: [courseId], references: [id])
  title         String
  description   String
  videoUrl      String    // URL en Bunny.net o Vimeo
  duration      Int       // segundos
  order         Int       // orden en el curso
  
  @@unique([courseId, order])
}

model VirtualClass {
  id            String    @id @default(cuid())
  teacherId     String
  teacher       TeacherProfile @relation(fields: [teacherId], references: [id])
  subject       String
  scheduledAt   DateTime
  duration      Int       // minutos
  hourlyRate    Float
  status        ClassStatus  // SCHEDULED, STARTED, COMPLETED, CANCELLED
  
  dailyRoomUrl  String?   // URL de la sala Daily.co
  bookings      ClassBooking[]
  
  @@index([teacherId])
  @@index([scheduledAt])
}

enum ClassStatus {
  SCHEDULED
  STARTED
  COMPLETED
  CANCELLED
}

model ClassBooking {
  id            String    @id @default(cuid())
  classId       String
  class         VirtualClass @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId     String
  student       StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  paymentId     String?   // ID de pago en Mercado Pago
  paymentStatus PaymentStatus
  
  createdAt     DateTime  @default(now())
  
  @@unique([classId, studentId])
}

model Subscription {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  plan          SubscriptionPlan  // MONTHLY, QUARTERLY, ANNUAL
  price         Float
  
  startsAt      DateTime  @default(now())
  endsAt        DateTime
  status        SubscriptionStatus
  
  mercadoPagoId String?   // ID de suscripción en Mercado Pago
  
  @@index([userId])
  @@index([endsAt])
}

enum SubscriptionPlan {
  MONTHLY
  QUARTERLY
  ANNUAL
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Estilos** | Tailwind CSS, Shadcn/ui |
| **Base de Datos** | PostgreSQL (Render) + Prisma ORM |
| **Autenticación** | NextAuth.js v5 |
| **Pagos** | Mercado Pago API |
| **Videollamadas** | Daily.co (o Whereby) |
| **Almacenamiento de videos** | Bunny.net o Vimeo |
| **Despliegue** | Render |

## 4. Variables de Entorno

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/appuntes"

# NextAuth
NEXTAUTH_URL="https://appuntes-xxx.onrender.com"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="YOUR_PUBLIC_KEY"
MERCADOPAGO_SECRET_KEY="YOUR_SECRET_KEY"

# Daily.co
DAILY_API_KEY="YOUR_API_KEY"

# Bunny.net (opcional para videos)
BUNNY_API_KEY="YOUR_API_KEY"
```

## 5. MVP - Fases de Desarrollo

### Fase 1: Foundation (Semana 1-2)
- [ ] Configurar PostgreSQL en Render
- [ ] Setup Prisma y modelos de BD
- [ ] Autenticación (NextAuth)
- [ ] Layouts y componentes base (Shadcn/ui)

### Fase 2: Core Features (Semana 3-4)
- [ ] Dashboard de alumnos
- [ ] Listado de cursos y videos
- [ ] Perfil de docentes
- [ ] Sistema de reserva de clases

### Fase 3: Pagos (Semana 5)
- [ ] Integración Mercado Pago (suscripciones)
- [ ] Integración Mercado Pago (pago por clase)
- [ ] Webhook para confirmación

### Fase 4: Videollamadas (Semana 6)
- [ ] Integración Daily.co
- [ ] Sala de clase virtual
- [ ] Historial de clases

### Fase 5: Polish & Deploy (Semana 7)
- [ ] Testing
- [ ] Optimizaciones
- [ ] Migración a producción

## 6. Flujos de Usuario

### Alumno
1. Signup → Email verification
2. Seleccionar grado (1-4 medio, PAES)
3. Ver cursos disponibles
4. Suscribirse ($5.990/mes)
5. Acceder a videos
6. Reservar clase con docente ($8.000-15.000/hr)
7. Ingresar a sala Daily.co a la hora programada

### Docente
1. Signup → Verificación manual
2. Configurar disponibilidad
3. Fijar tarifa horaria
4. Recibir reservas de alumnos
5. Hacer clase en Daily.co
6. Ver ingresos acumulados

## 7. Security & Compliance
- Encripción de contraseñas (bcryptjs)
- HTTPS obligatorio
- CORS configurado
- Rate limiting en APIs de pagos
- Validación de datos en backend
- Tokens JWT con expiración
