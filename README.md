# \# HealthBook — Patient Appointment Booking System

# 

# A full-stack web application that lets patients book doctor appointments online and lets doctors manage their availability and incoming bookings.

# 

# \*\*Live App:\*\* https://lustrous-puffpuff-e1070a.netlify.app

# \*\*GitHub Repo:\*\* https://github.com/nimrahmaqsood94-ctrl/appointment-booking-app

# 

# \---

# 

# \## 1. Problem Statement

# 

# Patients often struggle to book doctor appointments efficiently — relying on phone calls or walk-ins with no visibility into available time slots. Doctors and clinics lack a simple digital way to organize their daily schedule and track patient bookings. HealthBook solves this by providing a simple online platform where patients can browse doctors, view real-time availability, and book/cancel appointments, while doctors can manage their own slots and view/update the status of their bookings.

# 

# \## 2. Target Users \& Roles

# 

# \- \*\*Patient:\*\* Signs up, browses available doctors, books/cancels appointments, views appointment history.

# \- \*\*Doctor:\*\* Signs up, adds available time slots, views incoming appointments, marks them as completed or cancelled.

# 

# \## 3. Core Features

# 

# \- Email/password authentication with role selection (Patient / Doctor)

# \- Doctor listing with specialty

# \- Doctors can add available time slots

# \- Patients can book an open slot in real time

# \- Patients can view and cancel their own appointments

# \- Doctors can view and update (complete/cancel) appointments booked with them

# \- Role-based dashboards

# \- Responsive design (mobile \& desktop)

# \- Loading, empty, success, and error states across the app

# 

# \## 4. Tech Stack

# 

# | Layer | Technology |

# |---|---|

# | Frontend | React (Vite), React Router |

# | Backend / Auth / API | Supabase (Auth + auto-generated REST API) |

# | Database | Supabase (PostgreSQL) |

# | Hosting | Netlify |

# | Version Control | GitHub |

# 

# \## 5. Database Schema

# 

# \*\*profiles\*\*

# | Field | Type | Notes |

# |---|---|---|

# | id | uuid | PK, references auth.users(id) |

# | full\_name | text | required |

# | role | text | 'patient' or 'doctor' |

# | specialty | text | doctor only |

# | phone | text | optional |

# | created\_at | timestamp | default now() |

# 

# \*\*slots\*\*

# | Field | Type | Notes |

# |---|---|---|

# | id | uuid | PK |

# | doctor\_id | uuid | FK → profiles(id) |

# | slot\_date | date | |

# | start\_time | time | |

# | end\_time | time | |

# | is\_booked | boolean | default false |

# 

# \*\*appointments\*\*

# | Field | Type | Notes |

# |---|---|---|

# | id | uuid | PK |

# | patient\_id | uuid | FK → profiles(id) |

# | doctor\_id | uuid | FK → profiles(id) |

# | slot\_id | uuid | FK → slots(id), unique |

# | status | text | booked / completed / cancelled |

# | notes | text | optional |

# | created\_at | timestamp | default now() |

# 

# \*\*Relationships:\*\* A doctor has many slots (1:many). A slot maps to at most one appointment (1:1). A patient has many appointments (1:many). A doctor has many appointments (1:many).

# 

# \## 6. Security

# 

# \- Row Level Security (RLS) enabled on all three tables.

# \- Patients and doctors can only view/update appointments they are directly part of (`patient\_id = auth.uid()` or `doctor\_id = auth.uid()`).

# \- Doctors can only insert/manage their own slots (`doctor\_id = auth.uid()`).

# \- Profiles are readable by any authenticated user (needed to display the doctor directory), but each user can only insert/update their own profile row.

# \- Supabase environment keys (`VITE\_SUPABASE\_URL`, `VITE\_SUPABASE\_ANON\_KEY`) are stored in a local `.env` file, excluded from version control via `.gitignore`.

# 

# \## 7. Testing Performed

# 

# \- Doctor signup → login → add slot → verified slot appears

# \- Patient signup → login → viewed doctor list → booked a slot → verified appointment appears in "My Appointments"

# \- Cancelled appointment as patient → verified slot reopened and doctor dashboard reflected cancelled status

# \- Invalid input testing: empty signup fields, password under 6 characters — correctly blocked with error messages

# \- Refresh test: session persists correctly after page refresh

# \- Verified mobile and desktop responsive layouts

# \- Verified RLS policies block cross-user access to appointments/slots

# 

# \## 8. Deployment

# 

# \- Frontend built with `npm run build` and deployed via Netlify (drag-and-drop deploy)

# \- Environment variables configured for the Supabase connection

# \- Verified live authentication and live database read/write operations post-deployment

# 

# \## 9. Known Limitations

# 

# \- No email/SMS reminder notifications

# \- No payment integration

# \- No video consultation feature

# \- Doctor slot creation is manual (no recurring schedule templates)

# \- Single time zone assumed

# 

# \## 10. AI Tools Used

# 

# This project was built with the assistance of Claude (Anthropic) for: initial planning (problem definition, database schema design), generating the React + Supabase application code, styling/CSS, debugging (RLS policy errors, theme/contrast issues), and preparing this documentation. All architectural decisions, testing, and deployment were reviewed and executed by the developer.

# 

# \## 11. Setup Instructions (Local Development)

# 

# ```bash

# git clone https://github.com/nimrahmaqsood94-ctrl/appointment-booking-app.git

# cd appointment-booking-app

# npm install

# ```

# 

# Create a `.env` file in the root with:

# ```

# VITE\_SUPABASE\_URL=your\_supabase\_project\_url

# VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

# ```

# 

# Run locally:

# ```bash

# npm run dev

# ```React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev \& build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

