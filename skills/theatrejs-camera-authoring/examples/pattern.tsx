import { getProject } from '@theatre/core';
import state from './state.json';

// Production setup
const project = getProject('CinematicProject', { state });
const sheet = project.sheet('Scene');
// In Dev: import studio from '@theatre/studio'; studio.initialize();
