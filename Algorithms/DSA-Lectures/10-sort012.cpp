#include<iostream>
using namespace std;

void printArray(int arr[], int n){
    for(int i=0; i<n; i++){
        cout<<arr[i]<<" ";
    }
}

void sort(int arr[], int n){
    int left=0;
    int right=n-1;
    while(left<right){
        while(left < right && arr[left]==0){
            left++;
        }
        while(left < right && arr[right]==1){
            right--;
        }
        swap(arr[left],arr[right]);
        right--;
        left++;
        }
}

int main()
{
    int arr[9]={2,0,1,2,1,0,0,2,0};
    sort(arr,9);
    printArray(arr,9);
    
    return 0;
}