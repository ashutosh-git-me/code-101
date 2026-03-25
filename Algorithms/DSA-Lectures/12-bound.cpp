#include<iostream>
using namespace std;

int firstOccurence(int arr[], int n, int key){
    int start=0, end=n-1;
    int ans=-1;

    while(start<=end){
        int mid = start + (end - start) / 2;
        if(arr[mid]==key){
            ans=mid;
            end=mid-1;
        }
        else if(arr[mid]>key){
            end = mid-1;
        }
        else start=mid+1;
    }
    return ans;
}

int lastOccurence(int arr[], int n, int key){
    int start=0, end=n-1;
    int ans=-1;

    while(start<=end){
        int mid = start + (end - start) / 2;
        if(arr[mid]==key){
            ans=mid;
            start=mid+1;
        }
        else if(arr[mid]>key){
            end = mid-1;
        }
        else start=mid+1;
    }
    return ans;
}



int main()
{
    int even[14] = {1,2,3,3,3,3,3,3,3,3,3,3,3,5};
    int odd[5] = {5,15,34,42,49};

    cout << firstOccurence(even, 14, 3) << endl;
    cout << lastOccurence(even, 14, 3) << endl;
    return 0;
}

/*
pair<int, int> firstAndLastPosition(vector<int>& arr, int n, int k)
{
    pair<int, int> p;
    p.first=firstOccurence(arr, n, k);
    p.second=lastOccurence(arr, n, k);
    return p;
}

    return {firstOccurence(arr, n, k),lastOccurence(arr, n, k)}
*/

//no. of occurences (p.second-p.first)+1