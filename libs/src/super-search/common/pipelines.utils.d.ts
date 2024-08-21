import { PipelineStage, ProjectionType } from 'mongoose';
export declare const projectionConfig: (pipeline: PipelineStage[], projection?: ProjectionType<any> | null) => void;
export declare const sortPipelines: (pipeline: PipelineStage[]) => PipelineStage[];
export declare const deleteAllLookup: (pipeline: PipelineStage[]) => PipelineStage[];
