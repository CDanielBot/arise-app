import * as shell from "shelljs"
shell.cp("-R", "src/swagger.json", "dist/swagger.json")
shell.cp("-R", "private", "dist/private")
shell.cp("-R", "assets", "dist/assets")