from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.diary import TaskCreate, TaskUpdate, TaskResponse, TaskStatusSummary
from app import crud

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskResponse])
def read_tasks(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """ログイン中ユーザーのタスク一覧取得"""
    return crud.get_tasks(db, user_id=current_user.id)


@router.get("/summary", response_model=TaskStatusSummary)
def read_task_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """ステータス別タスク件数（トップ画面の円グラフ用）"""
    return crud.get_task_status_summary(db, user_id=current_user.id)


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """タスク手動作成"""
    return crud.create_task(db, user_id=current_user.id, task=task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """タスク更新（ステータス変更など）"""
    updated = crud.update_task(db, user_id=current_user.id, task_id=task_id, task=task)
    if updated is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", response_model=TaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """タスク削除"""
    deleted = crud.delete_task(db, user_id=current_user.id, task_id=task_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return deleted
