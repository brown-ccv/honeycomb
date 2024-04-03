# Powershell script for installing Honeycomb prerequisites
# Visit https://brown-ccv.github.io/honeycomb-docs/docs/quick_start for info

winget install -e --id Git.Git;
winget install -e --id GitHub.GitHubDesktop;
winget install -e --id CoreyButler.NVMforWindows
winget install -e --id Python.Python.3.11;
winget install -e --id ojdkbuild.openjdk.17.jre;
winget install -e --id Microsoft.VisualStudioCode;
winget install -e --id Microsoft.VisualStudio.2022.Community --override "--add Microsoft.VisualStudio.Workload.NativeDesktop --add Microsoft.VisualStudio.Component.VC.ATLMFC --includeRecommended";

# TODO @brown-ccv #278: Python management (miniconda)? [Python is only needed for PsiTurk]
# TODO @brown-ccv #453: Python.3.12 will need a pip install of setuptools
