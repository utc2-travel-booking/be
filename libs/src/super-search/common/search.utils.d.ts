import { PipelineStage } from 'mongoose';
export declare const createSearchPipeline: (search: any, searchType: string) => PipelineStage[];
export declare const addSearchConditionToPipeline: (pipeline: any[], operator: string, searchBy: string, keyword: any, searchType: string) => void;
