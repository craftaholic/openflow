import type { Skill } from '../../interfaces/skill'

export const k8sarchitecture: Skill = {
  name: "kubernetes",
  description: "Kubernetes cluster architecture and patterns",
  instruction: `# Kubernetes

## Architecture Overview

Components:
- Control Plane: API Server, etcd, Scheduler, Controller Manager
- Worker Nodes: Kubelet, Container Runtime, Kube Proxy

## Pod Design Patterns

Sidecar Pattern:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-sidecar
spec:
  containers:
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080

  - name: log-shipper
    image: fluent/fluent-bit:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app

  volumes:
  - name: logs
    emptyDir: {}
\`\`\`

Ambassador Pattern:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-ambassador
spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: DB_HOST
      value: "localhost"

  - name: db-proxy
    image: postgres-proxy:latest
    ports:
    - containerPort: 5432
\`\`\`

## Deployment Strategies

Rolling Update (Default):

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:v2
\`\`\`

Blue-Green Deployment:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:v1

---
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue
  ports:
  - port: 80
    targetPort: 8080
\`\`\`

Canary Deployment:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
      version: canary
  template:
    metadata:
      labels:
        app: myapp
        version: canary
    spec:
      containers:
      - name: myapp
        image: myapp:v2

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-canary
            port:
              number: 80
\`\`\`

## Resource Management

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: myapp:latest

    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "500m"

    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10

    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5

    terminationGracePeriodSeconds: 30
\`\`\`

## Networking

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-network-policy
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  - Egress

  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 8080

  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
\`\`\`

## Service Mesh Integration

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: myapp
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        env:
        - name: ISTIO_MUTUAL
          value: "true"
\`\`\`

## Best Practices

- Use namespaces for isolation
- Set resource requests/limits on all pods
- Implement liveness and readiness probes
- Use labels for organization
- Avoid running as root
- Use non-root images when possible
- Implement pod disruption budgets
- Use configmaps/secrets for configuration
- Enable RBAC and network policies
- Use Helm for templating
- Implement GitOps workflow
- Regular backups of etcd
- Monitor cluster health
`
}
