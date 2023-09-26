class BuildDataJsonFile {
    data() {
      return {
        permalink: "data.json"
      };
    }
  
    render(data) { 
        return JSON.stringify(data.all_pages)
    }
  }
  
  module.exports = BuildDataJsonFile;