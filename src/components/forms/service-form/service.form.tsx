import React, { useState } from "react";
import { addNewDockerService } from "store/project/project.store";
import { PortMapping, ServiceConfig } from "types/docker-compose.type";

interface ServiceFormProps {
  initialData?: Partial<ServiceConfig>;
  onCancel?: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ServiceConfig>>({
    image: "",
    container_name: "",
    ports: [],
    environment: {},
    restart: "unless-stopped",
    command: "",
    entrypoint: "",
    user: "",
    working_dir: "",
    ...initialData,
  });

  const [environmentVars, setEnvironmentVars] = useState<{ key: string; value: string }[]>(
    Object.entries(formData.environment || {}).map(([key, value]) => ({ key, value }))
  );

  const [ports, setPorts] = useState<PortMapping[]>(Array.isArray(formData.ports) ? formData.ports : []);

  const handleInputChange = (field: keyof ServiceConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEnvironmentChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...environmentVars];
    updated[index][field] = value;
    setEnvironmentVars(updated);

    const envObject = updated.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    handleInputChange("environment", envObject);
  };

  const addEnvironmentVar = () => {
    setEnvironmentVars((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeEnvironmentVar = (index: number) => {
    setEnvironmentVars((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePortChange = (index: number, value: string) => {
    const updated = [...ports];
    updated[index] = value;
    setPorts(updated);
    handleInputChange(
      "ports",
      updated.filter((p) => p)
    );
  };

  const addPort = () => {
    setPorts((prev) => [...prev, ""]);
  };

  const removePort = (index: number) => {
    setPorts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Фильтруем пустые значения
    const submitData: ServiceConfig = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object") return Object.keys(value || {}).length > 0;
        return value !== "" && value !== undefined;
      })
    ) as ServiceConfig;

    addNewDockerService({id: String(Date.now()), x: 0, y: 0, ...submitData});
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <input
          type="text"
          value={formData.image || ""}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="nginx:alpine"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Container Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Container Name</label>
        <input
          type="text"
          value={formData.container_name || ""}
          onChange={(e) => handleInputChange("container_name", e.target.value)}
          placeholder="my-container"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ports */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ports</label>
        <div className="space-y-2">
          {ports.map((port, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={port}
                onChange={(e) => handlePortChange(index, e.target.value)}
                placeholder="8080:80"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removePort(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPort}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Port
          </button>
        </div>
      </div>

      {/* Environment Variables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Environment Variables</label>
        <div className="space-y-2">
          {environmentVars.map((env, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={env.key}
                onChange={(e) => handleEnvironmentChange(index, "key", e.target.value)}
                placeholder="VARIABLE_NAME"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={env.value}
                onChange={(e) => handleEnvironmentChange(index, "value", e.target.value)}
                placeholder="value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeEnvironmentVar(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEnvironmentVar}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Environment Variable
          </button>
        </div>
      </div>

      {/* Restart Policy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Restart Policy</label>
        <select
          value={formData.restart || "unless-stopped"}
          onChange={(e) => handleInputChange("restart", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="no">No</option>
          <option value="always">Always</option>
          <option value="on-failure">On Failure</option>
          <option value="unless-stopped">Unless Stopped</option>
        </select>
      </div>

      {/* Command */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Command</label>
        <input
          type="text"
          value={Array.isArray(formData.command) ? formData.command.join(" ") : formData.command || ""}
          onChange={(e) => handleInputChange("command", e.target.value.split(" "))}
          placeholder="npm start"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Entrypoint */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Entrypoint</label>
        <input
          type="text"
          value={Array.isArray(formData.entrypoint) ? formData.entrypoint.join(" ") : formData.entrypoint || ""}
          onChange={(e) => handleInputChange("entrypoint", e.target.value.split(" "))}
          placeholder="/bin/sh -c"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
        <input
          type="text"
          value={formData.user || ""}
          onChange={(e) => handleInputChange("user", e.target.value)}
          placeholder="root"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Working Directory */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Working Directory</label>
        <input
          type="text"
          value={formData.working_dir || ""}
          onChange={(e) => handleInputChange("working_dir", e.target.value)}
          placeholder="/app"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Service
        </button>
      </div>
    </form>
  );
};
