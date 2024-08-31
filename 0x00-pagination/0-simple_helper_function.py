#!/usr/bin/env python3
"""page index module"""

from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """start and end index"""
    start = (page - 1) * page_size
    end = start + page_size

    return start, end
