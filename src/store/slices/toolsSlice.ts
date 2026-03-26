import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SchemaVersion } from '../../types';

interface ToolsState {
  decrypt: { cipherText: string; decryptedText: string; parsedJson: unknown; isCollapsed: boolean };
  encrypt: { plainText: string; encryptedText: string };
  formatter: { input: string; parsed: unknown; stringified: string; mode: 'format' | 'stringify' | null; isCollapsed: boolean };
  compare: { jsonA: string; jsonB: string; diffHtml: string | null; diffDelta: unknown };
  schema: { input: string; schema: unknown; version: SchemaVersion; strictMode: boolean; isCollapsed: boolean };
  base64: { encodeInput: string; encodeOutput: string; decodeInput: string; decodeOutput: string };
  jsonserialize: { serializeInput: string; serialized: string; indentSize: string; sortKeys: boolean; deserializeInput: string; deserialized: unknown; isCollapsed: boolean; revivedDates: boolean; activeMode: 'serialize' | 'deserialize' | null };
  charcounter: { text: string; showFreq: boolean };
  codetostring: { input: string; output: string; quoteStyle: 'double' | 'single' | 'backtick'; multiLine: boolean; mode: 'encode' | 'decode' };
}

const initialState: ToolsState = {
  decrypt: { cipherText: '', decryptedText: '', parsedJson: null, isCollapsed: false },
  encrypt: { plainText: '', encryptedText: '' },
  formatter: { input: '', parsed: null, stringified: '', mode: null, isCollapsed: false },
  compare: { jsonA: '', jsonB: '', diffHtml: null, diffDelta: null },
  schema: { input: '', schema: null, version: '2020-12', strictMode: true, isCollapsed: false },
  base64: { encodeInput: '', encodeOutput: '', decodeInput: '', decodeOutput: '' },
  jsonserialize: { serializeInput: '', serialized: '', indentSize: '2', sortKeys: false, deserializeInput: '', deserialized: null, isCollapsed: false, revivedDates: false, activeMode: null },
  charcounter: { text: '', showFreq: false },
  codetostring: { input: '', output: '', quoteStyle: 'double', multiLine: false, mode: 'encode' },
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setDecryptState: (state, action: PayloadAction<Partial<ToolsState['decrypt']>>) => {
      state.decrypt = { ...state.decrypt, ...action.payload };
    },
    setEncryptState: (state, action: PayloadAction<Partial<ToolsState['encrypt']>>) => {
      state.encrypt = { ...state.encrypt, ...action.payload };
    },
    setFormatterState: (state, action: PayloadAction<Partial<ToolsState['formatter']>>) => {
      state.formatter = { ...state.formatter, ...action.payload };
    },
    setCompareState: (state, action: PayloadAction<Partial<ToolsState['compare']>>) => {
      state.compare = { ...state.compare, ...action.payload };
    },
    setSchemaState: (state, action: PayloadAction<Partial<ToolsState['schema']>>) => {
      state.schema = { ...state.schema, ...action.payload };
    },
    setBase64State: (state, action: PayloadAction<Partial<ToolsState['base64']>>) => {
      state.base64 = { ...state.base64, ...action.payload };
    },
    setJsonSerializeState: (state, action: PayloadAction<Partial<ToolsState['jsonserialize']>>) => {
      state.jsonserialize = { ...state.jsonserialize, ...action.payload };
    },
    setCharCounterState: (state, action: PayloadAction<Partial<ToolsState['charcounter']>>) => {
      state.charcounter = { ...state.charcounter, ...action.payload };
    },
    setCodeToStringState: (state, action: PayloadAction<Partial<ToolsState['codetostring']>>) => {
      state.codetostring = { ...state.codetostring, ...action.payload };
    },
    resetToolState: (state, action: PayloadAction<keyof ToolsState>) => {
      const tool = action.payload;
      (state as Record<keyof ToolsState, unknown>)[tool] = initialState[tool];
    },
  },
});

export const {
  setDecryptState,
  setEncryptState,
  setFormatterState,
  setCompareState,
  setSchemaState,
  setBase64State,
  setJsonSerializeState,
  setCharCounterState,
  setCodeToStringState,
  resetToolState,
} = toolsSlice.actions;

export default toolsSlice.reducer;
