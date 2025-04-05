import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { McpTool } from "../../../../src/shared/mcp"
import { useAppTranslation } from "../../i18n/TranslationContext"
import { vscode } from "../../utils/vscode"

type McpToolRowProps = {
	tool: McpTool
	serverName?: string
	serverSource?: "global" | "project"
	alwaysAllowMcp?: boolean
}

const McpToolRow = ({ tool, serverName, serverSource, alwaysAllowMcp }: McpToolRowProps) => {
	const { t } = useAppTranslation()
	const handleAlwaysAllowChange = () => {
		if (!serverName) return
		vscode.postMessage({
			type: "toggleToolAlwaysAllow",
			serverName,
			source: serverSource || "global",
			toolName: tool.name,
			alwaysAllow: !tool.alwaysAllow,
		})
	}

	return (
		<div
			key={tool.name}
			style={{
				padding: "3px 0",
			}}>
			<div
				data-testid="tool-row-container"
				style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
				onClick={(e) => e.stopPropagation()}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<span className="codicon codicon-symbol-method" style={{ marginRight: "6px" }}></span>
					<span style={{ fontWeight: 500 }}>{tool.name}</span>
				</div>
				{serverName && alwaysAllowMcp && (
					<VSCodeCheckbox checked={tool.alwaysAllow} onChange={handleAlwaysAllowChange} data-tool={tool.name}>
						{t("mcp:tool.alwaysAllow")}
					</VSCodeCheckbox>
				)}
			</div>
			{tool.description && (
				<div
					style={{
						marginLeft: "0px",
						marginTop: "4px",
						opacity: 0.8,
						fontSize: "var(--text-sm)",
					}}>
					{tool.description}
				</div>
			)}
			{tool.inputSchema &&
				"properties" in tool.inputSchema &&
				Object.keys(tool.inputSchema.properties as Record<string, any>).length > 0 && (
					<div
						style={{
							marginTop: "8px",
							fontSize: "var(--text-sm)",
							border: "1px solid color-mix(in srgb, var(--vscode-descriptionForeground) 30%, transparent)",
							borderRadius: "var(--radius-sm)",
							padding: "8px",
						}}>
						<div
							style={{
								marginBottom: "4px",
								opacity: 0.8,
								fontSize: "var(--text-sm)",
								textTransform: "uppercase",
							}}>
							{t("mcp:tool.parameters")}
						</div>
						{Object.entries(tool.inputSchema.properties as Record<string, any>).map(
							([paramName, schema]) => {
								const isRequired =
									tool.inputSchema &&
									"required" in tool.inputSchema &&
									Array.isArray(tool.inputSchema.required) &&
									tool.inputSchema.required.includes(paramName)

								return (
									<div
										key={paramName}
										style={{
											display: "flex",
											alignItems: "baseline",
											marginTop: "4px",
										}}>
										<code
											style={{
												color: "var(--vscode-textPreformat-foreground)",
												marginRight: "8px",
											}}>
											{paramName}
											{isRequired && (
												<span style={{ color: "var(--vscode-errorForeground)" }}>*</span>
											)}
										</code>
										<span
											style={{
												opacity: 0.8,
												overflowWrap: "break-word",
												wordBreak: "break-word",
											}}>
											{schema.description || t("mcp:tool.noDescription")}
										</span>
									</div>
								)
							},
						)}
					</div>
				)}
		</div>
	)
}

export default McpToolRow
