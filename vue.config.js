// vue.config.js - project root

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "com.theFox6.todomanager",
                productName: "ToDo Manager",
                icon: "src/assets/todo-manager.png",
                linux: {
                    //target: "AppImage",
                    category: "Office",
                    icon: "src/assets/todo-manager.png"
                }
            }
        }
    }
}