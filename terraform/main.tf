# terraform/main.tf

# 1. Configure the AWS Provider
provider "aws" {
  region = "us-east-1" # Or your preferred region like ap-south-1
}

# 2. Define Variables that Jenkins will provide
variable "aws_region" {
  description = "The AWS region to create resources in."
  default     = "us-east-1"
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

# 3. Define the Security Group (Firewall) for the server
resource "aws_security_group" "app_sg" {
  name        = "ai-copilot-sg"
  description = "Allow HTTP and SSH inbound traffic"

  # Allow incoming web traffic on port 80
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow incoming SSH traffic on port 22 for management
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Define the EC2 Instance (the server) itself
resource "aws_instance" "app_server" {
  # This is a standard Ubuntu 22.04 AMI for the us-east-1 region.
  # If you use a different region, you will need to find the correct AMI ID for that region.
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"      # Free-tier eligible
  key_name      = "my-aws-key"    # The name of the key pair you created in your AWS account
  security_groups = [aws_security_group.app_sg.name]

  # This startup script runs automatically when the server is created
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io awscli # Install Docker and AWS CLI

              # Add the ubuntu user to the docker group so we can run docker without sudo
              sudo usermod -aG docker ubuntu

              # Log in to AWS ECR (Elastic Container Registry)
              aws ecr get-login-password --region ${var.aws_region} | sudo docker login --username AWS --password-stdin ${split("/", var.ecr_image_uri)[0]}

              # Pull the specific Docker image that Jenkins pushed to ECR
              sudo docker pull ${var.ecr_image_uri}

              # Stop and remove any old container with the same name
              sudo docker stop ai-co-pilot-container || true
              sudo docker rm ai-co-pilot-container || true

              # Run the new container, passing the Gemini API key as a secure environment variable
              sudo docker run -d --name ai-co-pilot-container -p 80:8000 -e GEMINI_API_KEY=${var.gemini_api_key} ${var.ecr_image_uri}
              EOF

  tags = {
    Name = "AI-Career-Co-Pilot-Server"
  }
}