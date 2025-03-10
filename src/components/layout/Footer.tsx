export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} 사내 QnA 시스템. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">이용약관</span>
              <span className="text-sm">이용약관</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">개인정보처리방침</span>
              <span className="text-sm">개인정보처리방침</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">고객지원</span>
              <span className="text-sm">고객지원</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 