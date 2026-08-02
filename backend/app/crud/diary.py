from sqlalchemy.orm import Session
from app.models.diary import DiaryEntry, Task, STATUS_UNRESOLVED, STATUS_RESOLVED
from app.schemas.diary import DiaryEntryCreate, TaskCreate, TaskUpdate


def create_diary_entry(db: Session, user_id: int, entry: DiaryEntryCreate):
    """日記作成。未解決なことが入力されていれば、自動でタスクを起票する"""
    status = STATUS_UNRESOLVED if entry.unresolved_content else STATUS_RESOLVED
    db_entry = DiaryEntry(
        user_id=user_id,
        learned_content=entry.learned_content,
        key_learning_point=entry.key_learning_point,
        unresolved_content=entry.unresolved_content,
        status=status,
    )
    db.add(db_entry)
    db.flush()

    if entry.unresolved_content:
        db.add(Task(
            user_id=user_id,
            diary_entry_id=db_entry.id,
            title=entry.unresolved_content,
            status=STATUS_UNRESOLVED,
        ))

    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_diary_entries(db: Session, user_id: int):
    """ログインユーザーの日記一覧（新しい順）"""
    return (
        db.query(DiaryEntry)
        .filter(DiaryEntry.user_id == user_id)
        .order_by(DiaryEntry.entry_date.desc(), DiaryEntry.id.desc())
        .all()
    )


def get_tasks(db: Session, user_id: int):
    """ログインユーザーのタスク一覧（新しい順）"""
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def get_task(db: Session, user_id: int, task_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def create_task(db: Session, user_id: int, task: TaskCreate):
    """タスク手動作成"""
    db_task = Task(
        user_id=user_id,
        title=task.title,
        description=task.description,
        study_time=task.study_time,
        status=task.status,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, user_id: int, task_id: int, task: TaskUpdate):
    """タスク更新（ステータス変更など）"""
    db_task = get_task(db, user_id, task_id)
    if not db_task:
        return None
    if task.title is not None:
        db_task.title = task.title
    if task.description is not None:
        db_task.description = task.description
    if task.study_time is not None:
        db_task.study_time = task.study_time
    if task.status is not None:
        db_task.status = task.status
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, user_id: int, task_id: int):
    db_task = get_task(db, user_id, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task


def get_task_status_summary(db: Session, user_id: int):
    """トップ画面の円グラフ用：ステータス別タスク件数"""
    tasks = get_tasks(db, user_id)
    total = len(tasks)
    unresolved = sum(1 for t in tasks if t.status == STATUS_UNRESOLVED)
    resolved = sum(1 for t in tasks if t.status == STATUS_RESOLVED)
    in_progress = total - unresolved - resolved
    return {
        "unresolved": unresolved,
        "in_progress": in_progress,
        "resolved": resolved,
        "total": total,
    }
