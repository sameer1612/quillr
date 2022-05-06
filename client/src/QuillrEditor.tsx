import Quill, { TextChangeHandler } from 'quill';
import 'quill/dist/quill.snow.css';
import { LegacyRef, useCallback, useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';


const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function QuillrEditor() {
  const [socket, setSocket] = useState<Socket>()
  const [quill, setQuill] = useState<Quill>()

  useEffect(() => {
    const connection = io("http://localhost:3001")
    setSocket(connection)

    return () => {
      connection.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler: TextChangeHandler = (delta, oldContents, source) => {
      if (source !== 'user')
        return;
      socket?.emit('send-changes', delta);
    }

    quill?.on('text-change', handler)

    return () => {
      quill?.off('text-change', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta: any) => {
      quill.updateContents(delta)
    }

    socket?.on('receive-changes', handler)

    return () => {
      socket?.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", (document) => {
      // quill.clipboard.dangerouslyPasteHTML(0, document.html)
      const delta = quill.clipboard.convert(document.html);
      quill.setContents(delta, 'silent');

      quill.enable()
    })
    socket.emit("get-document", { data: "test" })
  }, [socket, quill])

  const wrapperRef: LegacyRef<HTMLElement> = useCallback((wrapper: HTMLElement) => {
    if (wrapper == null) return

    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    wrapper.append(editor)
    const quill = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS
      }
    });
    setQuill(quill)
    quill.disable()
    quill.setText('Loading document...')
  }, []);

  const saveChanges = () => {
    if (socket == null || quill == null) return

    console.log("Saving document");
    socket.emit("save-document", { html: quill.root.innerHTML })
  }

  return <div>
    <button id='btn-save' className='btn btn-outline-success' onClick={saveChanges}>Save</button>
    <div id="editor" className='bg-white' ref={wrapperRef}></div>
  </div>
}