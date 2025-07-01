terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.43.0"
    }

   random = {
      source  = "hashicorp/random"
      version = "~> 3.6.2"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0.5"
    }

    cloudinit = {
      source  = "hashicorp/cloudinit"
      version = "~> 2.3.5"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27.0"
    }
  }

  backend "s3" {
    bucket = "gitopsterrastate"
    key    = "terraform.tfstate"
    region = "us-east-2"
  }

  required_version = "~> 1.9.2"
}
