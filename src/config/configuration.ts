import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const fileName = 'config.yaml';

export default function configuration(): Record<string, any> {
    return yaml.load(
        readFileSync(join(__dirname, '../..', fileName), 'utf8'),
    ) as Record<string, any>;
}
