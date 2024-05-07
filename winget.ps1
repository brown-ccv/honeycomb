# Powershell script for installing Honeycomb prerequisites
# Visit https://brown-ccv.github.io/honeycomb-docs/docs/quick_start for info
winget install -e --id Git.Git;
winget install -e --id GitHub.GitHubDesktop;
winget install -e --id CoreyButler.NVMforWindows
winget install -e --id Python.Python.3.12;
winget install -e --id ojdkbuild.openjdk.17.jre;
winget install -e --id Microsoft.VisualStudioCode;

# TODO @brown-ccv #278: Python management (miniconda)? [Python is only needed for PsiTurk]
