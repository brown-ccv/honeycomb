# Powershell script for installing Honeycomb prerequisites
# Visit https://brown-ccv.github.io/honeycomb-docs/docs/quick_start for info

winget install -e --id Git.Git;
winget install -e --id GitHub.GitHubDesktop;
winget install -e --id OpenJS.NodeJS.LTS;
winget install -e --id Python.Python.3.11;
winget install -e --id Oracle.JDK.19;
winget install -e --id Microsoft.VisualStudioCode;
winget install -e --id Microsoft.VisualStudio.2022.Community --override "--add Microsoft.VisualStudio.Workload.NativeDesktop --add Microsoft.VisualStudio.Component.VC.ATLMFC --includeRecommended"

# TODO: Python management (miniconda)?
