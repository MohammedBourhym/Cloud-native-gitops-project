# Command Buddy - GitOps EKS Deployment Project

A **GitOps demonstration project** showcasing enterprise-grade deployment of a full-stack application to AWS EKS using modern DevOps practices and tools.

![alt text](image.png)
![alt text](image-1.png)

## Project Purpose

This project demonstrates **GitOps best practices** for deploying applications to Kubernetes (AWS EKS) using:

- **Infrastructure as Code** (Terraform)
- **Containerization** (Docker)
- **CI/CD Pipelines** (GitHub Actions)
- **Package Management** (Helm Charts)
- **Code Quality** (SonarCloud)
- **Multi-environment deployments** (main → production, stage → staging)

## Architecture

**Application Stack:**
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Spring Boot + Java 17
- **Database**: MongoDB
- **AI Integration**: Groq LLM API

**DevOps Stack:**
- **Infrastructure**: AWS EKS, Terraform
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Package Management**: Helm
- **Code Quality**: SonarCloud
- **GitOps**: Branch-based deployments

## GitOps Workflow

### Branch Strategy
- **`main`** → Production environment (AWS EKS Production)
- **`stage`** → Staging & testing environment (AWS EKS Staging)

### Deployment Pipeline
1. **Code Push** → Triggers GitHub Actions
2. **Quality Gates** → SonarCloud analysis
3. **Build** → Docker images
4. **Infrastructure** → Terraform applies changes
5. **Deploy** → Helm charts to EKS
6. **Validate** → Health checks and tests

## Project Structure

```
command-buddy/
├── .github/workflows/           # GitHub Actions CI/CD pipelines
├── app/
│   ├── buddy/                   # Spring Boot backend
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   └── command-buddy-client/    # React frontend
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── infra/
│   ├── terraform/               # Infrastructure as Code
│   │   ├── main.tf
│   │   ├── vpc.tf
│   │   └── variables.tf
│   ├── kubernetes/              # K8s manifests
│   │   └── eks-cluster.tf
│   └── helm/                    # Helm charts (coming soon)
└── README.md
```

## DevOps Tools Used

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Terraform** | Infrastructure as Code | `infra/terraform/` |
| **GitHub Actions** | CI/CD Pipeline | `.github/workflows/` |
| **Docker** | Containerization | `Dockerfile` in each service |
| **Helm** | Kubernetes Package Manager | `infra/helm/` |
| **SonarCloud** | Code Quality & Security | GitHub Actions integration |
| **AWS EKS** | Kubernetes Cluster | Managed via Terraform |

## Getting Started

### Prerequisites
- AWS CLI configured
- kubectl installed
- Terraform >= 1.9
- Docker
- Node.js 18+
- Java 17+

### Local Development
```bash
# Clone repository
git clone <repo-url>
cd command-buddy

# Start backend
cd app/buddy
./mvnw spring-boot:run

# Start frontend
cd ../command-buddy-client
npm install && npm run dev
```

### Infrastructure Deployment
```bash
# Deploy to staging
git checkout stage
git push origin stage
```

## Application Features

The Command Buddy application serves as a **real-world example** for GitOps demonstration:

- **Interactive CLI Learning**: Generate quiz questions for Docker, Kubernetes, Git, etc.
- **AI-Powered Feedback**: Groq LLM evaluates answers and provides explanations
- **Command Repository**: Save and search learned commands
- **Terminal-Inspired UI**: Modern React interface with terminal aesthetics

## Environment Configuration

### Secrets Management (Production)
```bash
# AWS Secrets Manager (recommended)
aws secretsmanager create-secret --name "command-buddy/groq-api-key" --secret-string "your-api-key"
aws secretsmanager create-secret --name "command-buddy/mongodb-uri" --secret-string "your-mongodb-uri"
```

### GitHub Repository Secrets
Required secrets for CI/CD pipeline:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `BUCKET_TF_STATE`
- `GROQ_API_KEY`
- `SONAR_TOKEN`

## CI/CD Pipeline

### Triggered on:
- **Push to `main`** → Production deployment
- **Push to `stage`** → Staging deployment
- **Pull Request** → Quality checks and preview

### Pipeline Steps:
1. **Code Quality** → SonarCloud analysis
2. **Build** → Docker images with tags
3. **Infrastructure** → Terraform plan/apply
4. **Deploy** → Helm install/upgrade
5. **Test** → Health checks and smoke tests

##  Monitoring & Observability

- **Application Logs**: CloudWatch integration
- **Infrastructure Metrics**: AWS CloudWatch
- **Application Health**: Kubernetes readiness/liveness probes
- **Code Quality**: SonarCloud dashboards

##  Security Best Practices

- **Secrets**: AWS Secrets Manager (never in Git)
- **Container Security**: Non-root users, minimal base images
- **Network**: VPC, security groups, ingress controls
- **Code Quality**: SonarCloud security scans
- **IAM**: Least privilege principles

##  GitOps Benefits Demonstrated

1. **Infrastructure as Code**: Reproducible environments
2. **Declarative Deployments**: Desired state management
3. **Version Control**: All changes tracked in Git
4. **Automated Rollbacks**: Easy revert capabilities
5. **Multi-Environment**: Consistent deployment patterns
6. **Security**: Centralized secret management

##  Learning Outcomes

This project teaches:
- **GitOps workflow implementation**
- **AWS EKS cluster management**
- **Terraform infrastructure patterns**
- **Docker multi-stage builds**
- **GitHub Actions CI/CD**
- **Helm chart development**
- **Security best practices**
