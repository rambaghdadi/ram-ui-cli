import {componentLocation} from "./helpers.js"
import fs from "fs-extra"

export default async function downloadFolder(componentName) {
  const baseUrl = `https://api.github.com/repos/rambaghdadi/ram-ui/contents/`
  const relativeUrl = `src/stories/`
  const path = componentLocation[componentName]

  let apiUrl = ""
  if (componentName.includes(relativeUrl)) {
    apiUrl = baseUrl + componentName
  } else {
    apiUrl = baseUrl + relativeUrl + path + "/" + componentName
  }

  try {
    // Get list of files and subdirectories
    const response = await fetch(apiUrl)
    const items = await response.json()

    for (const item of items) {
      if (item.type === "file") {
        if (item.name.includes(".stories.ts")) continue

        let path = item.path.split("/").slice(3).join("/")
        // Download the file
        await downloadFile(item.download_url, path)
      } else if (item.type === "dir") {
        // Recursively download the directory
        await downloadFolder(item.path)
      }
    }
  } catch (error) {
    throw error
  }
}

async function downloadFile(url, filePath) {
  try {
    const response = await fetch(url)
    const data = await response.text()
    saveFile(filePath, data)
  } catch (error) {
    throw error
  }
}

function saveFile(filePath, fileData) {
  fs.outputFile(filePath, fileData, (err) => {
    if (err) throw err
    console.log("Component has been created in the current directory.")
  })
}
