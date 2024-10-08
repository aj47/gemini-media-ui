import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const apiFeatures = [
  { id: 'describe', label: 'Describe content' },
  { id: 'summarize', label: 'Summarize content' },
  { id: 'extrapolate', label: 'Extrapolate from content' },
]

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [model, setModel] = useState('gemini-1.5-pro')
  const [result, setResult] = useState('')

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'],
      'video/*': ['.mp4', '.mpeg', '.mov', '.avi', '.flv', '.mpg', '.webm', '.wmv', '.3gpp'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to process files
    setResult('Processing...')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Selected files:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <Label htmlFor="model">Select Model</Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Select API Features</Label>
        <div className="space-y-2">
          {apiFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={(checked) => {
                  setSelectedFeatures(
                    checked
                      ? [...selectedFeatures, feature.id]
                      : selectedFeatures.filter((id) => id !== feature.id)
                  )
                }}
              />
              <Label htmlFor={feature.id}>{feature.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit">Process Files</Button>
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded">{result}</pre>
        </div>
      )}
    </form>
  )
}