#!/usr/bin/env python3
"""pagination module"""

import csv
import math
from typing import Tuple, List, Dict, Optional


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """start and end index"""
    start = (page - 1) * page_size
    end = start + page_size

    return start, end


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """return dataset page"""
        assert isinstance(page, int)
        assert page > 0
        assert isinstance(page_size, int)
        assert page_size > 0

        start, end = index_range(page, page_size)
        dataset = self.dataset()

        return dataset[start:end] if start < len(dataset) else []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[
            str, Optional[int]]:
        """pagination details as dict"""
        data = self.get_page(page, page_size)
        items_total = len(self.dataset())
        total_pages = math.ceil(items_total / page_size)

        page_details = {
            "page_size": len(data),
            "page": page,
            "data": data,
            "next_page": page + 1 if page < total_pages else None,
            "prev_page": page - 1 if page > 1 else None,
            "total_pages": total_pages
        }

        return page_details
