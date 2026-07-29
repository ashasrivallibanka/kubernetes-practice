# Kubernetes Project 7 - Secrets

## Objective

Understand how Kubernetes Secrets securely store sensitive information and how applications consume Secrets without hardcoding credentials inside the application.

---

### What is a Secret?

A Secret is a Kubernetes resource used to store sensitive information securely.

Examples:

- Database Username
- Database Password
- API Keys
- JWT Tokens
- OAuth Tokens
- TLS Certificates
- SSH Keys

Applications read Secrets at runtime instead of storing credentials inside the application code.

---

### Why do we need Secrets?

Sensitive information should never be hardcoded inside:

- Application source code
- Docker images
- Kubernetes ConfigMaps

Secrets separate sensitive information from application code.

---

### Secret Architecture

```text
Developer

↓

Creates Secret

↓

Kubernetes Stores Secret

↓

Pod Starts

↓

Reads Secret

↓

Application Uses Credentials
```

---

## ConfigMap vs Secret

### ConfigMap

Stores non-sensitive information.

Examples:

- Application Name
- Port
- Environment
- Log Level
- API URL

---

### Secret

Stores sensitive information.

Examples:

- Passwords
- API Keys
- Access Tokens
- Certificates
- SSH Keys

---

### Create Secret

Create Secret using literals

```bash
kubectl create secret generic app-secret \
--from-literal=DB_USERNAME=admin \
--from-literal=DB_PASSWORD=admin123
```

---

### View Secrets

List Secrets

```bash
kubectl get secrets
```

Describe Secret

```bash
kubectl describe secret app-secret
```

View Secret YAML

```bash
kubectl get secret app-secret -o yaml
```

---

### Base64 Encoding

Kubernetes stores Secret values as Base64 encoded data.

Example

Original

```text
admin123
```

Base64

```text
YWRtaW4xMjM=
```

Important:

Base64 is NOT encryption.

It only converts data into another format.

Production clusters should enable encryption at rest.

---

### Use Secret as Environment Variables

Create

```text
pod-secret-env.yaml
```

Apply

```bash
kubectl apply -f pod-secret-env.yaml
```

Verify Pod

```bash
kubectl get pods
```

Enter Pod

```bash
kubectl exec -it secret-env-demo -- /bin/sh
```

View Environment Variables

```bash
printenv
```

Expected

```text
DB_USERNAME=admin

DB_PASSWORD=admin123
```

Exit

```bash
exit
```

---

### Environment Variable Flow

```text
Secret

↓

Environment Variables

↓

Pod

↓

Application
```

Applications read credentials from environment variables.

---

### Use Secret as Volume

Create

```text
pod-secret-volume.yaml
```

Apply

```bash
kubectl apply -f pod-secret-volume.yaml
```

Enter Pod

```bash
kubectl exec -it secret-volume-demo -- /bin/sh
```

View Mounted Files

```bash
ls /etc/secret
```

Expected

```text
DB_USERNAME

DB_PASSWORD
```

Read Username

```bash
cat /etc/secret/DB_USERNAME
```

Read Password

```bash
cat /etc/secret/DB_PASSWORD
```

Exit

```bash
exit
```

---

### Volume Mount Flow

```text
Secret

↓

Mounted as Files

↓

Pod

↓

Application Reads Files
```

This approach is commonly used for:

- TLS Certificates
- SSL Keys
- SSH Keys
- Configuration Files containing sensitive information

---

### Update Secret

Delete Secret

```bash
kubectl delete secret app-secret
```

Create Again

```bash
kubectl create secret generic app-secret \
--from-literal=DB_USERNAME=admin \
--from-literal=DB_PASSWORD=Admin@2026
```

Verify

```bash
kubectl describe secret app-secret
```

---

### Important Note

If a Secret is consumed as Environment Variables,

Pods must usually be restarted after updating the Secret.

If mounted as files,

Kubernetes updates the mounted files after a short delay, but many applications still need a reload or restart before they use the updated values.

---

### Create Secret using YAML

File

```text
secret.yaml
```

Example

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: app-secret

type: Opaque

stringData:
  DB_USERNAME: admin
  DB_PASSWORD: admin123
```

Apply

```bash
kubectl apply -f secret.yaml
```

Verify

```bash
kubectl get secrets
```

Describe

```bash
kubectl describe secret app-secret
```

---

## Understanding Secret YAML

### apiVersion

```yaml
apiVersion: v1
```

Uses Kubernetes Core API.

---

### kind

```yaml
kind: Secret
```

Creates a Secret resource.

---

### metadata

```yaml
metadata:
  name: app-secret
```

Defines the Secret name.

---

### type

```yaml
type: Opaque
```

Opaque is the default Secret type for generic key-value Secrets.

---

### stringData

```yaml
stringData:
```

Stores secret values in plain text within the YAML file.

Kubernetes automatically converts them to Base64 when the Secret is created.

---

## Secret Types

### Opaque

Default type.

Stores generic key-value data.

---

### kubernetes.io/tls

Stores TLS certificate and private key.

---

### kubernetes.io/dockerconfigjson

Stores Docker registry credentials.

---

### kubernetes.io/basic-auth

Stores username and password.

---

### kubernetes.io/ssh-auth

Stores SSH private keys.

---

## Environment Variables vs Volume Mounts

### Environment Variables

Best for:

- Database Username
- Database Password
- API Keys
- Tokens

Pod restart usually required after Secret changes.

---

### Volume Mounts

Best for:

- TLS Certificates
- SSL Certificates
- SSH Keys
- Secret Files

Files update automatically after a short delay, though applications may still need to reload or restart.

---

## Secret vs ConfigMap

### ConfigMap

- Non-sensitive information
- Plain configuration
- Application settings

Examples:

- Port
- Environment
- Log Level

---

### Secret

- Sensitive information
- Credentials
- Tokens
- Certificates

Examples:

- Password
- API Key
- JWT Secret
- TLS Certificate

---

### Troubleshooting

List Secrets

```bash
kubectl get secrets
```

Describe Secret

```bash
kubectl describe secret app-secret
```

View Secret YAML

```bash
kubectl get secret app-secret -o yaml
```

Check Pods

```bash
kubectl get pods
```

Verify Environment Variables

```bash
kubectl exec -it secret-env-demo -- printenv
```

Verify Mounted Files

```bash
kubectl exec -it secret-volume-demo -- ls /etc/secret
```

Read Secret File

```bash
kubectl exec -it secret-volume-demo -- cat /etc/secret/DB_PASSWORD
```

---

## Common Problems

### Secret Not Found

Reason:

Wrong Secret name.

Solution

```bash
kubectl get secrets
```

---

### Key Not Found

Reason:

Incorrect Secret key.

Solution

```bash
kubectl describe secret app-secret
```

---

### Wrong Credentials

Reason:

Secret contains incorrect values.

Solution:

Update or recreate the Secret and restart the Pod if using environment variables.

---

### Application Cannot Read Mounted Secret

Check:

- Secret name
- Mount path
- File permissions
- Pod status

---

### Real Production Usage

Secrets are commonly used for:

- Database Passwords
- Database Usernames
- API Keys
- JWT Tokens
- OAuth Tokens
- TLS Certificates
- SSL Certificates
- SSH Keys
- Docker Registry Credentials

---

### Key Learnings

- Secrets store sensitive information.
- Secrets separate credentials from application code.
- Pods can consume Secrets as environment variables.
- Pods can consume Secrets as mounted files.
- Secrets are Base64 encoded by default.
- Base64 encoding is not encryption.
- Production clusters should enable encryption at rest.
- Secrets improve application security.
- YAML is the preferred way to manage Secrets.

