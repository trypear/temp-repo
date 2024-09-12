import { debounce } from "lodash";
import { useEffect, useState } from "react";
import useUIConfig from "../../hooks/useUIConfig";
import CodeBlockToolBar from "./CodeBlockToolbar";

function childToText(child: any) {
  if (typeof child === "string") {
    return child;
  } else if (child?.props) {
    return childToText(child.props?.children);
  } else if (Array.isArray(child)) {
    return childrenToText(child);
  } else {
    return "";
  }
}

function childrenToText(children: any) {
  return children.map((child: any) => childToText(child)).join("");
}

interface CollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
  position: "top" | "bottom";
}

const CollapseButton: React.FC<CollapseButtonProps> = ({
  collapsed,
  onClick,
  position,
}) => {
  const topStyle = position === "top" ? { top: "-9px" } : { bottom: "-10px" };

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: collapsed ? "-11px" : "-2px",
        backgroundColor: "transparent",
        color: "lightgray",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
        border: "none",
        ...topStyle,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        {collapsed ? (
          <path d="M6.999,0v16h2.002V0H6.999z M12.172,9H10V7h2.172l-1.586-1.586L12,4l4,4l-4,4l-1.414-1.414L12.172,9z" />
        ) : position === "top" ? (
          <path d="M0,6.999v2.002h16V6.999H0z M9,12.172V10H7v2.172l-1.586-1.586L4,12l4,4l4-4l-1.414-1.414L9,12.172z" />
        ) : (
          <path d="M0,6.999v2.002h16V6.999H0z M7,3.828V6h2V3.828l1.586,1.586L12,4L8,0L4,4l1.414,1.414L7,3.828z" />
        )}
      </svg>
    </button>
  );
};

function PreWithToolbar(props: {
  children: any;
  language: string | undefined;
}) {
  const uiConfig = useUIConfig();
  const toolbarBottom = uiConfig?.codeBlockToolbarPosition == "bottom";

  const [hovering, setHovering] = useState(false);
  const [copyValue, setCopyValue] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const debouncedEffect = debounce(() => {
      setCopyValue(childrenToText(props.children.props.children));
    }, 100);

    debouncedEffect();

    return () => {
      debouncedEffect.cancel();
    };
  }, [props.children]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{ paddingLeft: "0px", position: "relative" }}
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <CollapseButton
        collapsed={collapsed}
        onClick={toggleCollapse}
        position="top"
      />

      {!collapsed && (
        <>
          {!toolbarBottom && hovering && (
            <CodeBlockToolBar
              text={copyValue}
              bottom={toolbarBottom}
              language={props.language}
            />
          )}

          {props.children}

          {toolbarBottom && hovering && (
            <CodeBlockToolBar
              text={copyValue}
              bottom={toolbarBottom}
              language={props.language}
            />
          )}

          <CollapseButton
            collapsed={collapsed}
            onClick={toggleCollapse}
            position="bottom"
          />
        </>
      )}
    </div>
  );
}

export default PreWithToolbar;
