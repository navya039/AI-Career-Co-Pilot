# terraform/main.tf

# 1. Configure the AWS Provider
provider "aws" {
  region = "ap-south-1"
}

# 2. Define Variables from Jenkins
variable "aws_region" {
  description = "The AWS region to create resources in."
  default     = "ap-south-1"
}

variable "ecr_image_uri" {
  description = "The full URI of the Docker image in ECR."
  type        = string
}

variable "gemini_api_key" {
  description = "The Google Gemini API key."
  type        = string
  sensitive   = true
}

# 3. Define Security Group
resource "aws_security_group" "app_sg" {
  name        = "ai-copilot-sg"
  description = "Allow HTTP and SSH inbound traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Create EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-02a2af70a66af6dfb" # ✅ Verified for ap-south-1 (Mumbai)
  instance_type = "t2.micro"
  key_name      = "ai-aws-key"

  # ✅ Use security group ID
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io awscli
              usermod -aG docker ubuntu

              aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${split("/", var.ecr_image_uri)[0]}
              docker pull ${var.ecr_image_uri}

              docker stop ai-co-pilot-container || true
              docker rm ai-co-pilot-container || true

              docker run -d --name ai-co-pilot-container -p 80:8000 -e GEMINI_API_KEY=${var.gemini_api_key} ${var.ecr_image_uri}
              EOF

  tags = {
    Name = "AI-Career-Co-Pilot-Server"
  }
}

