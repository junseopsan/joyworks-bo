-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(question_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE questions
  SET view_count = view_count + 1
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql;

-- 알림 생성 트리거 함수
CREATE OR REPLACE FUNCTION create_answer_notification()
RETURNS TRIGGER AS $$
DECLARE
  question_author_id UUID;
BEGIN
  -- 질문 작성자 ID 가져오기
  SELECT author_id INTO question_author_id
  FROM questions
  WHERE id = NEW.question_id;
  
  -- 질문 작성자와 답변 작성자가 다른 경우에만 알림 생성
  IF question_author_id != NEW.author_id THEN
    INSERT INTO notifications (
      user_id,
      type,
      message,
      is_read,
      created_at
    ) VALUES (
      question_author_id,
      'ANSWER',
      '회원님의 질문에 새로운 답변이 등록되었습니다.',
      false,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 답변 등록 시 알림 트리거
CREATE TRIGGER answer_notification_trigger
AFTER INSERT ON answers
FOR EACH ROW
EXECUTE FUNCTION create_answer_notification();

-- 댓글 알림 트리거 함수
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  target_author_id UUID;
BEGIN
  -- 댓글이 질문에 대한 것인지 답변에 대한 것인지 확인
  IF NEW.question_id IS NOT NULL AND NEW.answer_id IS NULL THEN
    -- 질문에 대한 댓글
    SELECT author_id INTO target_author_id
    FROM questions
    WHERE id = NEW.question_id;
    
    -- 질문 작성자와 댓글 작성자가 다른 경우에만 알림 생성
    IF target_author_id != NEW.author_id THEN
      INSERT INTO notifications (
        user_id,
        type,
        message,
        is_read,
        created_at
      ) VALUES (
        target_author_id,
        'COMMENT',
        '회원님의 질문에 새로운 댓글이 등록되었습니다.',
        false,
        NOW()
      );
    END IF;
  ELSIF NEW.answer_id IS NOT NULL THEN
    -- 답변에 대한 댓글
    SELECT author_id INTO target_author_id
    FROM answers
    WHERE id = NEW.answer_id;
    
    -- 답변 작성자와 댓글 작성자가 다른 경우에만 알림 생성
    IF target_author_id != NEW.author_id THEN
      INSERT INTO notifications (
        user_id,
        type,
        message,
        is_read,
        created_at
      ) VALUES (
        target_author_id,
        'COMMENT',
        '회원님의 답변에 새로운 댓글이 등록되었습니다.',
        false,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 댓글 등록 시 알림 트리거
CREATE TRIGGER comment_notification_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION create_comment_notification();

-- 도움이 됨 투표 알림 트리거 함수
CREATE OR REPLACE FUNCTION create_helpful_vote_notification()
RETURNS TRIGGER AS $$
DECLARE
  answer_author_id UUID;
BEGIN
  -- 답변 작성자 ID 가져오기
  SELECT author_id INTO answer_author_id
  FROM answers
  WHERE id = NEW.answer_id;
  
  -- 답변 작성자와 투표자가 다른 경우에만 알림 생성
  IF answer_author_id != NEW.user_id THEN
    INSERT INTO notifications (
      user_id,
      type,
      message,
      is_read,
      created_at
    ) VALUES (
      answer_author_id,
      'HELPFUL',
      '회원님의 답변이 도움이 되었다는 평가를 받았습니다.',
      false,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 도움이 됨 투표 시 알림 트리거
CREATE TRIGGER helpful_vote_notification_trigger
AFTER INSERT ON helpful_votes
FOR EACH ROW
EXECUTE FUNCTION create_helpful_vote_notification();

-- 답변 채택 알림 트리거 함수
CREATE OR REPLACE FUNCTION create_accepted_answer_notification()
RETURNS TRIGGER AS $$
DECLARE
  answer_author_id UUID;
BEGIN
  -- 새로 채택된 답변인 경우에만 처리
  IF NEW.is_accepted = true AND (OLD.is_accepted = false OR OLD.is_accepted IS NULL) THEN
    -- 답변 작성자 ID 가져오기
    SELECT author_id INTO answer_author_id
    FROM answers
    WHERE id = NEW.id;
    
    -- 질문 작성자 ID 가져오기
    DECLARE
      question_author_id UUID;
    BEGIN
      SELECT author_id INTO question_author_id
      FROM questions
      WHERE id = NEW.question_id;
      
      -- 질문 작성자와 답변 작성자가 다른 경우에만 알림 생성
      IF question_author_id != answer_author_id THEN
        INSERT INTO notifications (
          user_id,
          type,
          message,
          is_read,
          created_at
        ) VALUES (
          answer_author_id,
          'ACCEPTED',
          '회원님의 답변이 채택되었습니다.',
          false,
          NOW()
        );
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 답변 채택 시 알림 트리거
CREATE TRIGGER accepted_answer_notification_trigger
AFTER UPDATE ON answers
FOR EACH ROW
EXECUTE FUNCTION create_accepted_answer_notification(); 