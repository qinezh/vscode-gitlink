import * as fs from "fs-extra";
import * as path from "path";

export default class Helper {
    public static async getRepoRoot(filePath: string): Promise<string | null> {
        let currentFolder = this.normalize(path.dirname(filePath));
        while (true) {
            const configFolder = path.join(currentFolder, ".git");
            if (await fs.pathExists(configFolder)) {
                return currentFolder;
            }

            const index = currentFolder.lastIndexOf("/");
            if (index < 0) {
                break;
            }

            currentFolder = currentFolder.substring(0, index);
        }
        return null;
    }

    public static normalize(filePath: string): string {
        return filePath.replace(/\\/g, "/");
    }
}
