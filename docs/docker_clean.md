# Docker Storage Problem & Cleanup Guide

## Problem Overview

### What is Docker Storage Problem?

Docker Desktop on Windows uses Virtual Hard Disks (VHD) files to store container data, images, and build caches. These VHD files have a critical limitation: **they never automatically shrink**, even when you delete containers and images.

### Why Does This Happen?

1. **VHD Files Never Shrink Automatically**
   - Docker uses WSL2 (Windows Subsystem for Linux 2) with VHDX files
   - When data is deleted inside the VHD, the space remains allocated to Windows
   - Only explicit export/import operations compact and return space to Windows

2. **Build Cache Accumulation**
   - Docker layer caching stores intermediate build results
   - Over time, build cache can grow 3-12GB between cleanups
   - `docker builder prune` only clears Docker internals, not Windows disk space

3. **Unused Images and Containers**
   - Images and stopped containers accumulate and consume space
   - Kubernetes images alone can take 600MB-900MB when enabled
   - Without cleanup, VHD can grow from 0.14GB to 25-30GB in hours/days

4. **Volumes**
   - Named volumes and mount data persist after containers are deleted
   - Can accumulate hundreds of MB over time

### Symptoms

- ❌ C: or D: drive rapidly fills up (loss of 25-30GB in hours/days)
- ❌ `docker system df` shows high disk usage but `docker prune` doesn't free Windows space
- ❌ VHD files (`docker_data.vhdx`, `ext4.vhdx`) keep growing
- ❌ Even with 0 images/containers, VHD doesn't shrink
- ❌ Docker Desktop reports space but Windows shows it as used

---

## Docker Storage Cleanup Flow

### Step 1: Clean Docker Cache & Containers

```powershell
# Remove stopped containers
docker container prune -f

# Remove dangling images (untagged)
docker image prune -f

# Remove ALL unused images (even tagged ones)
docker image prune -a -f

# Remove build cache
docker builder prune -a -f

# Remove unused volumes
docker volume prune -a -f

# Verify what's left
docker system df
```

**Expected:** Significant space freed inside Docker (100MB - 5GB depending on usage)

