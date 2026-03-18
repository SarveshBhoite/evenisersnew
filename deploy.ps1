# Deployment script for Hostinger (Subtree Branching)

# Push the backend folder to the backend-deploy branch
Write-Host "Pushing backend to backend-deploy branch..."
git subtree push --prefix backend origin backend-deploy

# Push the frontend folder to the frontend-deploy branch
Write-Host "Pushing frontend to frontend-deploy branch..."
git subtree push --prefix frontend origin frontend-deploy

Write-Host "Deployment branches updated! Now go to Hostinger HPanel and update your sites to use these branches."
