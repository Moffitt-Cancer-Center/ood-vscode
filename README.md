# Open OnDemand VSCode Server App (Apptainer) - Moffitt HPC

This repository contains the necessary files to deploy a VSCode Server application within an Apptainer container on an Open OnDemand (OOD) platform, specifically customized for the Moffitt HPC environment. This setup provides a consistent and reproducible environment for code development.

**Important:** This app is highly customized for the Moffitt HPC environment and may require modifications for other systems.

## Features

* **Containerized Environment:** VSCode Server runs inside an Apptainer container using Docker images from `dockerhub.moffitt.org/ood/rocker-multi`
* **Version Selection:** Choose between Latest or Latest-ML (machine learning optimized) VSCode containers
* **GPU Support:** Optional NVIDIA A30 GPU allocation via checkbox selection
* **Conda Environment Integration:** Optional conda environment binding for custom Python/R environments
* **Working Directory Selection:** Choose your starting project directory or default to $HOME
* **Persistent State:** VSCode settings, extensions, and configurations persist across sessions
* **Custom Logging:** Session-specific logging to dedicated directories
* **Advanced Options:** QoS tier selection, reservation support, and conda environment selection available via toggle
* **Secure Authentication:** Password-based authentication with encrypted cookies

## Prerequisites

* Open OnDemand installation (version 2.0+)
* Apptainer/Singularity installed on compute nodes
* Access to `dockerhub.moffitt.org/ood/rocker-multi` container images
* Slurm job scheduler
* Shared filesystem accessible from compute nodes

## Form Fields

### Basic Options

* **Request GPU:** Checkbox to request 1 NVIDIA A30 GPU
* **Cores:** Number of CPU cores (default: 1)
* **Memory (GB):** Memory allocation in GB (default: 2)
* **Runtime (hours):** Job walltime in hours (1-336, default: 1)
* **VSCode Version:** Select Latest or Latest-ML container
* **Working Directory:** Path selector for starting directory (default: $HOME)

### Advanced Options (Hidden by default)

* **Show Advanced Options:** Checkbox to reveal advanced settings
* **QoS:** Quality of Service tier (default: normal)
* **Conda Environment:** Optional conda environment name to bind into container
* **Reservation:** Optional Slurm reservation name

## Installation

1. **Copy the app directory:**

    ```bash
    # For system-wide deployment
    sudo cp -r vscode /var/www/ood/apps/sys/
    
    # For development
    cp -r vscode ~/ondemand/dev/
    ```

2. **Verify container image access:**

    ```bash
    apptainer pull docker://dockerhub.moffitt.org/ood/rocker-multi:latest
    apptainer pull docker://dockerhub.moffitt.org/ood/rocker-multi:ml
    ```

3. **Restart the web server (if system-wide):**

    ```bash
    sudo /opt/ood/nginx_stage/sbin/nginx_stage nginx_clean
    ```

## Container Images

The app uses two container variants:

* **Latest** (`docker://dockerhub.moffitt.org/ood/rocker-multi:latest`): Standard VSCode Server with common development tools
* **Latest-ML** (`docker://dockerhub.moffitt.org/ood/rocker-multi:ml`): VSCode Server with machine learning libraries and GPU support

## Conda Environment Support

When a conda environment is specified, the app searches in:
1. `$HOME/.conda/envs/`
2. `$HOME/miniconda3/envs/`
3. `$HOME/anaconda3/envs/`

The environment is bound to `/opt/share/code-server/conda` inside the container.

## Slurm Job Configuration

Default job parameters:
* Partition: `red`
* QoS: `normal`
* Nodes: 1
* Tasks: 1
* Memory: 2GB
* Cores: 1
* GPU: 0

These can be customized via the form.

## File Structure

```
vscode/
├── form.yml              # OOD form definition
├── form.js               # Form behavior and validation
├── submit.yml.erb        # Slurm job submission template
├── manifest.yml          # App metadata
├── view.html.erb         # Connection view template
├── README.md             # This file
└── template/
    ├── script.sh.erb     # Main job script
    ├── before.sh.erb     # Pre-execution setup (optional)
    └── after.sh.erb      # Post-execution cleanup (optional)
```

## Troubleshooting

### VSCode won't start
* Check job log: `~/ondemand/data/sys/vscode/output/<job_id>/job_startup.log`
* Verify container image is accessible
* Check available resources on the partition

### Conda environment not found
* Verify the environment exists in one of the searched locations
* Check environment name spelling in the form
* Review job log for specific error messages

### GPU not available
* Verify GPU resources are available on the partition
* Check that the GPU checkbox was selected
* Confirm GPU allocation in job output

## Security

* Password-based authentication using OOD-generated passwords
* Secure cookie-based session management
* All data confined to user's home directory and temporary session directories
* Container runs as the user (not root)

## Support

For issues specific to the Moffitt HPC environment, contact your HPC support team.

For Open OnDemand general issues, see: https://osc.github.io/ood-documentation/

## License

See LICENSE file for details.

## Building the Apptainer Image (If Customization is Needed)

If you need to customize the R environment, you can build your own Apptainer image based on the `dockerhub.moffitt.org/hpc/rocker-rstudio` image. Here's an example `Singularity` file:

    singularity
Bootstrap: docker
From: dockerhub.moffitt.org/hpc/rocker-rstudio:latest

%post
    # Install any additional R packages
    R -e "install.packages(c('tidyverse', 'shiny', 'ggplot2'))"

    # Install system dependencies (if needed)
    apt-get update && apt-get install -y --no-install-recommends \
        libxml2-dev \
        libcurl4-openssl-dev

%environment
    # Set environment variables
    export R_LIBS_USER="/opt/R/library"

%runscript
    # Start RStudio Server
    exec /usr/lib/rstudio-server/bin/rserver --www-port 8787 --www-address=0.0.0.0
