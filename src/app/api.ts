export const BASE_URL = 'http://localhost:8000';

export async function generateDesign(
  roomImage: File,
  inspirationImage: File | null,
  preferences: {
    style: string;
    color_tone: string;
    room_type: string;
    to_remove: string[];
    to_add: string[];
  },
  projectName: string,
  signal?: AbortSignal
): Promise<string> {
  const formData = new FormData();
  formData.append('room_image', roomImage);
  if (inspirationImage) {
    formData.append('inspiration_image', inspirationImage);
  }
  formData.append('project_name', projectName);
  formData.append('text_input', JSON.stringify(preferences));

  const response = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to generate design');
  }

  const data = await response.json();
  return `${BASE_URL}${data.generated_image_url}`;
}

export interface Project {
  id: string;
  projectName: string;
  outputImageUrl: string;
  inputImageUrl: string | null;
  createdAt: number;
  preferences?: {
    style: string;
    colorTone: string;
    roomType: string;
    selectedFurniture: string[];
    removedFurniture: string[];
  };
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${BASE_URL}/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  const data = await response.json();

  const jsonFiles = (data.outputs as Array<{ filename: string; url: string; created_at: number }>)
    .filter(f => f.filename.endsWith('.json'));

  const projects = await Promise.all(
    jsonFiles.map(async file => {
      const meta = await fetch(`${BASE_URL}${file.url}`).then(r => r.json());
      const textInput = meta.text_input ?? {};
      return {
        id: file.filename,
        projectName: meta.project_name || file.filename,
        outputImageUrl: meta.output_image ? `${BASE_URL}/outputs/${meta.output_image}` : '',
        inputImageUrl: meta.input_image ? `${BASE_URL}/inputs/${meta.input_image}` : null,
        createdAt: file.created_at,
        preferences: {
          style: textInput.style ?? '',
          colorTone: textInput.color_tone ?? '',
          roomType: textInput.room_type ?? '',
          selectedFurniture: textInput.to_add ?? [],
          removedFurniture: textInput.to_remove ?? [],
        },
      };
    })
  );

  return projects.sort((a, b) => b.createdAt - a.createdAt);
}

export async function clearHistory(): Promise<void> {
  const response = await fetch(`${BASE_URL}/history`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to clear history');
}
