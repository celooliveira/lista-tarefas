import { useState , useEffect, useRef, useMemo, useCallback} from 'react'
import './App.css'

function App() {
  const inputRef = useRef<HTMLIFrameElement>(null)
  const firstRender = useRef(true)

  const [editTask,setEditTask] = useState({
    enable:false,
    task:''
  })
  const [input,setInput] = useState("");
  const [task,setTask] = useState<string[]>([]);

  useEffect(()=>{
    const tarefasSAlvas = localStorage.getItem("@cursoreact")
    if(tarefasSAlvas){
      setTask(JSON.parse(tarefasSAlvas))
    }
  },[])

  useEffect(()=>{
    if (firstRender.current){
      firstRender.current = false;
      return
    }
    localStorage.setItem("@cursoreact",JSON.stringify(task))

  },[task])

  const handleRegister = useCallback(()=>{
    if(!input){
      alert('Preencha o nome da tarefa!')
      return;
    }

    if(editTask.enable){
      handleSaveEdit();
      return;
    }

    setTask(tarefas => [...tarefas,input])
    setInput("")
  },[input,task])
/*
  function handleRegister(){
    if(!input){
      alert('Informe a tarefa')
      return
    }
    if(editTask.enable){
      handleSaveEdit();
      return;
    }
    setTask(tarefas => [...tarefas,input])
    setInput("")

    localStorage.setItem("@cursoreact",JSON.stringify([...task,input]))
  }
  */

  function handleSaveEdit(){
    const findIndexTask = task.findIndex(task => task === editTask.task)
    const allTasks = [...task];

    allTasks[findIndexTask] = input;
    setTask(allTasks);

    setEditTask({
      enable:false,
      task:""
    })
    setInput('');
    localStorage.setItem("@cursoreact",JSON.stringify([allTasks]));
  }

  function handleDelete(item:string){
    const removeTask = task.filter(task => task !==item)
    setTask(removeTask)
    localStorage.setItem("@cursoreact",JSON.stringify([removeTask]));
  }

  function handleEdit(item:string){
    inputRef.current?.focus();
    setInput(item)
    setEditTask({
      enable:true,
      task:item
    })
  }

  const totalTarefas =useMemo(()=>{
    return task.length
  },[task])

  return (
    <div>
      <h1>Lista de tarefas</h1>
      
      <input 
        placeholder='Digite o nome da tarefa'
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        ref={inputRef}
      />

      <button onClick={handleRegister}>
        {editTask.enable ? "Atualizar tarefa" : "Adcionar tarefa"}</button>
      
      <hr />

      <strong>Você tem {totalTarefas} tarefas</strong>
      <br /><br />

      {task.map((item,index)=>(
        <section key={item}>
          <span>
            {item}
          </span>
          <button onClick={()=>handleEdit(item)}>Editar</button>
          <button onClick={()=>handleDelete(item)}>Excluir</button>

        </section>
      ))}
    </div>
  )
}

export default App
