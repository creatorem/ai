import 'uniwind';
import { ThemeVariable } from '~/components/context/theme-provider';


declare module 'uniwind' {
    export const useCSSVariable: (varName: ThemeVariable) => string
}

export {}
